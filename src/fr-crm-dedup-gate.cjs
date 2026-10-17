'use strict';
/**
 * F9.5 • Distributed admission control for server-to-server CRM ingestion.
 * Upstash REST EVAL is atomic per key. No customer data is written to Redis;
 * only a pseudonymous event UUID and a keyed digest are retained.
 *
 * This controls concurrent writes, not a transaction spanning Redis + Notion.
 * When the Notion outcome is uncertain, do not release the lease early.
 */
const crypto=require('node:crypto');
const LEASE_SECONDS=120;
const DONE_SECONDS=30*24*60*60;
const KEY_PREFIX='fr:crm:idempotency:v1:';
const CLAIM_LUA=[
 "local state = redis.call('GET', KEYS[1])",
 "if not state then",
 "  redis.call('SET', KEYS[1], 'working:' .. ARGV[1], 'EX', 120)",
 "  return 1",
 "end",
 "if state == 'done:' .. ARGV[2] then return 2 end",
 "if string.sub(state, 1, 5) == 'done:' then return 3 end",
 "return 0"
].join('\n');
const COMPLETE_LUA=[
 "if redis.call('GET', KEYS[1]) ~= 'working:' .. ARGV[1] then return 0 end",
 "redis.call('SET', KEYS[1], 'done:' .. ARGV[2], 'EX', 2592000)",
 "return 1"
].join('\n');
function configured(env=process.env){
 const url=env.FR_CRM_REDIS_REST_URL,token=env.FR_CRM_REDIS_REST_TOKEN;
 if(typeof url!=='string'||typeof token!=='string'||token.length<30)return false;
 try{
  const u=new URL(url);
  return u.protocol==='https:'&&/^[a-z0-9-]+\.upstash\.io$/i.test(u.hostname)
   &&u.pathname==='/'&&!u.username&&!u.password&&!u.search&&!u.hash&&!u.port;
 }catch(_){return false}
}
function fingerprint(lead,secret){
 if(typeof secret!=='string'||secret.length<32)throw new Error('CRM_SECRET_UNAVAILABLE');
 return crypto.createHmac('sha256',secret).update(JSON.stringify(lead),'utf8').digest('hex');
}
async function redis(env,args,fetchImpl=fetch){
 if(!configured(env))throw new Error('CRM_REDIS_NOT_CONFIGURED');
 const response=await fetchImpl(env.FR_CRM_REDIS_REST_URL.replace(/\/$/,'') ,{
  method:'POST',
  redirect:'error',
  headers:{'Authorization':'Bearer '+env.FR_CRM_REDIS_REST_TOKEN,'Content-Type':'application/json'},
  body:JSON.stringify(args),signal:AbortSignal.timeout(5000)
 });
 if(!response.ok)throw new Error('CRM_REDIS_UNAVAILABLE');
 const data=await response.json();
 if(!data||typeof data!=='object'||Array.isArray(data)||!Object.hasOwn(data,'result')||Object.hasOwn(data,'error'))
  throw new Error('CRM_REDIS_BAD_RESULT');
 return data.result;
}
async function processOnce(lead,task,{env=process.env,fetchImpl=fetch}={}){
 if(!configured(env))throw new Error('CRM_REDIS_NOT_CONFIGURED');
 const eventId=lead.eventId;
 if(typeof eventId!=='string'||!/^[a-f0-9-]{36}$/.test(eventId))throw new Error('CRM_BAD_EVENT_ID');
 if(typeof task!=='function')throw new TypeError('CRM_TASK_REQUIRED');
 const key=KEY_PREFIX+eventId;
 const digest=fingerprint(lead,env.FR_CRM_INGEST_SECRET);
 const nonce=crypto.randomBytes(20).toString('hex');
 const result=await redis(env,['EVAL',CLAIM_LUA,1,key,nonce,digest],fetchImpl);
 if(result===0)return 'retry_later';
 if(result===2)return 'already_received';
 if(result===3)return 'conflict';
 if(result!==1)throw new Error('CRM_REDIS_UNEXPECTED_LOCK');
 // No Redis token, digest or event key goes into the Notion payload.
 // task() performs the existing Notion query-then-insert under the lease.
 const outcome=await task();
 if(outcome!=='received'&&outcome!=='already_received')throw new Error('CRM_UNCONFIRMED_NOTION_OUTCOME');
 const confirmation=await redis(env,['EVAL',COMPLETE_LUA,1,key,nonce,digest],fetchImpl);
 if(confirmation!==1)throw new Error('CRM_LEASE_EXPIRED_BEFORE_CONFIRMATION');
 return outcome;
}
module.exports=Object.freeze({configured,fingerprint,processOnce,redis,LEASE_SECONDS,DONE_SECONDS});
