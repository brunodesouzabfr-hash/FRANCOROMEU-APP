'use strict';
// Serverless route only. No browser app references and no cross-origin admission.
// Without four explicitly supplied private variables, this endpoint returns 404.
const {ingest}=require('../src/fr-crm-secure-ingest.cjs');
module.exports=async function frCrmIntake(req,res){return ingest(req,res)};
