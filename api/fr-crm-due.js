'use strict';
const {followups}=require('../src/fr-crm-private-followups.cjs');
module.exports=async function frCrmDue(req,res){return followups(req,res)};
