'use strict';
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const originalFetch = global.fetch;
const original = { key: process.env.GOOGLE_PLACES_API_KEY, place: process.env.GOOGLE_PLACE_ID, enabled: process.env.FR_GOOGLE_REVIEWS_ENABLED };
afterEach(() => {
  global.fetch = originalFetch;
  for (const [key, value] of Object.entries({ GOOGLE_PLACES_API_KEY: original.key, GOOGLE_PLACE_ID: original.place, FR_GOOGLE_REVIEWS_ENABLED: original.enabled })) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
async function call(options = {}) {
  delete require.cache[require.resolve('../api/google-reviews.js')];
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, json(body) { this.body = body; return this; } };
  await require('../api/google-reviews.js')({ method: 'GET', headers: {}, ...options }, res);
  return res;
}
function configured() {
  process.env.FR_GOOGLE_REVIEWS_ENABLED = 'true'; process.env.GOOGLE_PLACES_API_KEY = 'server-test-value'; process.env.GOOGLE_PLACE_ID = 'ChIJGYE8a2tCQKcRLapQAfIGtZk';
}
test('fallback não faz consulta paga quando não configurado', async () => {
  delete process.env.GOOGLE_PLACES_API_KEY;
  global.fetch = () => { throw new Error('must not fetch'); };
  const res = await call(); assert.deepEqual(res.body, { status: 'not_configured' }); assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('retorna avaliações atribuídas sem chave e sem armazenamento', async () => {
  configured();
  global.fetch = async (url, options) => {
    assert.match(url, /^https:\/\/places.googleapis.com\/v1\/places\/ChIJ/);
    assert.equal(options.headers['X-Goog-Api-Key'], 'server-test-value');
    return { ok: true, json: async () => ({ displayName: { text: 'Franco Romeu' }, rating: 4.8, userRatingCount: 8, reviews: [{ rating: 5, originalText: { text: 'Texto de teste' }, authorAttribution: { displayName: 'Autor de teste', uri: 'https://www.google.com/maps/contrib/test' }, googleMapsUri: 'https://www.google.com/maps/reviews/test' }] }) };
  };
  const res = await call(); assert.equal(res.body.status, 'ok'); assert.equal(res.body.reviews[0].author.displayName, 'Autor de teste'); assert.doesNotMatch(JSON.stringify(res.body), /server-test-value/);
});
test('vazio, erro da fonte e erro de rede mantêm estados explícitos', async () => {
  configured();
  global.fetch = async () => ({ ok: true, json: async () => ({ displayName: { text: 'Franco Romeu' } }) });
  assert.deepEqual((await call()).body.reviews, []);
  global.fetch = async () => ({ ok: false }); assert.equal((await call()).code, 503);
  global.fetch = async () => { throw new Error('network'); }; assert.equal((await call()).code, 503);
});
test('identidade incorreta, método e origem cruzada são rejeitados', async () => {
  configured();
  global.fetch = async () => ({ ok: true, json: async () => ({ displayName: { text: 'Outra empresa' } }) });
  assert.equal((await call()).code, 503);
  assert.equal((await call({ method: 'POST' })).code, 405);
  assert.equal((await call({ headers: { 'sec-fetch-site': 'cross-site' } })).code, 403);
});
test('timeout aborta a consulta e mantém o fallback', async () => {
  configured();
  global.fetch = (url, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }));
  const response = await call(); assert.equal(response.code, 503); assert.deepEqual(response.body, { status: 'unavailable' });
});
test('limite por cliente impede consultas excessivas na mesma instância', async () => {
  configured();let requests=0;
  global.fetch=async()=>{requests++;return{ok:true,json:async()=>({displayName:{text:'Franco Romeu'}})}};
  delete require.cache[require.resolve('../api/google-reviews.js')];
  const handler=require('../api/google-reviews.js');
  for(let index=0;index<6;index++){
    const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(body){this.body=body;return this}};
    await handler({method:'GET',headers:{'x-forwarded-for':'192.0.2.1'}},res);
    assert.equal(res.code,index<5?200:429);
  }
  assert.equal(requests,5);
});
