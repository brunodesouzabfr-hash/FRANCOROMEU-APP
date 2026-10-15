'use strict';

const ORIGIN = 'https://www.francoromeufr.com.br';

const TRACKING = Object.freeze({
  ga4: 'G-C3FMZ4NGGY',
  clarity: 'yvdvt0rcy6',
  ahrefs: 'R5uObk7S/kmy79NyRbbXsA',
  googleVerification: 'E_RRRPq5Hdni9bYjyrxFS2487bqKtuc9KijeiIeoLBg',
  pinterestVerification: 'feefd2f4d4ca08f595a42c56885b37ad'
});

function trackingHead() {
  // Keep verification metadata public, but collect only on the canonical
  // production hostname. Local and Vercel preview pages are not site visits.
  return '<meta name="google-site-verification" content="'+TRACKING.googleVerification+'">'
    +'<meta name="p:domain_verify" content="'+TRACKING.pinterestVerification+'">'
    +'<script>(function(){'
    +'if(window.location.hostname!=="www.francoromeufr.com.br")return;'
    +'(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","'+TRACKING.clarity+'");'
    +'window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};'
    +'window.gtag("js",new Date());window.gtag("config","'+TRACKING.ga4+'");'
    +'var ga4=document.createElement("script");ga4.async=true;ga4.src="https://www.googletagmanager.com/gtag/js?id='+TRACKING.ga4+'";document.head.appendChild(ga4);'
    +'var ahrefs=document.createElement("script");ahrefs.async=true;ahrefs.src="https://analytics.ahrefs.com/analytics.js";ahrefs.setAttribute("data-key","'+TRACKING.ahrefs+'");document.head.appendChild(ahrefs);'
    +'})();</script>';
}

function normalize(value) {
  return JSON.parse(JSON.stringify(value)
    .replaceAll('https://francoromeufr.com.br', ORIGIN)
    .replaceAll(ORIGIN+'/#localbusiness', ORIGIN+'/#organization'));
}

function composeGraph({ sourceGraph, organization, pageNodes = [], includeServices = false, includeItemList = false, includeFaq = false }) {
  const source = normalize(sourceGraph || { '@context':'https://schema.org', '@graph':[] });
  const sourceNodes = source['@graph'] || [];
  const institutional = normalize(organization.jsonld_base);
  delete institutional['@context'];
  institutional['@type'] = ['Organization', 'LocalBusiness', 'HomeAndConstructionBusiness'];
  institutional['@id'] = ORIGIN + '/#organization';
  const website = sourceNodes.find(node => node['@type'] === 'WebSite') || {
    '@type':'WebSite', '@id':ORIGIN+'/#website', url:ORIGIN+'/', name:'Franco Romeu — Arte & Engenharia'
  };
  website.publisher = { '@id': institutional['@id'] };
  const services = sourceNodes.filter(node => node['@type'] === 'Service');
  if (includeServices && services.length !== 16) throw new Error('Grafo institucional deve preservar 16 serviços');
  const nodes = [institutional, website];
  if (includeItemList) nodes.push(...sourceNodes.filter(node => node['@type'] === 'ItemList'));
  if (includeFaq) nodes.push(...sourceNodes.filter(node => node['@type'] === 'FAQPage'));
  if (includeServices) nodes.push(...services);
  nodes.push(...pageNodes.map(normalize));
  const ids = new Set();
  for (const node of nodes) {
    if (node['@id'] && ids.has(node['@id'])) throw new Error('JSON-LD @id duplicado: '+node['@id']);
    if (node['@id']) ids.add(node['@id']);
  }
  const serialized = JSON.stringify(nodes);
  if (/aggregateRating|"Review"/.test(serialized)) throw new Error('Avaliação não autorizada no JSON-LD');
  if (serialized.includes('"geo"')) throw new Error('Geo pontual não verificado no JSON-LD público');
  return { '@context':'https://schema.org', '@graph':nodes };
}

function breadcrumb(route, label, parent) {
  const items = [{ '@type':'ListItem', position:1, name:'Franco Romeu', item:ORIGIN+'/' }];
  if (parent) items.push({ '@type':'ListItem', position:2, name:parent.name, item:ORIGIN+parent.route });
  items.push({ '@type':'ListItem', position:items.length+1, name:label, item:ORIGIN+route });
  return { '@type':'BreadcrumbList', '@id':ORIGIN+route+'#breadcrumb', itemListElement:items };
}

module.exports = { ORIGIN, TRACKING, trackingHead, composeGraph, breadcrumb };
