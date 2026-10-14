'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {execFileSync} = require('node:child_process');
const googleReviews = require('../api/google-reviews.js');
const baseline = process.argv.includes('--baseline');
const baselineHTML = baseline ? execFileSync('git', ['show', '49295469979958569d2f6f5a32c397853f2fb7a9:index.html'], { maxBuffer: 8 * 1024 * 1024 }) : null;
const root = path.resolve(baseline ? '.' : (process.env.FR_PREVIEW_DIR || 'dist'));
const routes = new Set(['/', '/sobre', '/ambientes', '/projetos-3d', '/portfolio', '/orcamento']);
const mime = { '.html': 'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.avif': 'image/avif' };
http.createServer(async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const url = new URL(req.url, 'http://127.0.0.1');
  if (baseline && routes.has(url.pathname)) { res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(baselineHTML); }
  if (url.pathname === '/api/google-reviews') {
    res.status = code => { res.statusCode = code; return res; };
    res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); return res; };
    return googleReviews(req, res);
  }
  let decoded;
  try { decoded=decodeURIComponent(url.pathname); } catch(error) { res.statusCode=400;return res.end('Endereço inválido'); }
  let file = routes.has(url.pathname) ? path.join(root, url.pathname === '/' ? 'index.html' : url.pathname.slice(1) + '.html') : path.resolve(root, '.' + decoded);
  if (!baseline && file.startsWith(root + path.sep) && !path.extname(decoded) && fs.existsSync(file + '.html')) file += '.html';
  if (!baseline && file.startsWith(root + path.sep) && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.statusCode = 404; file = path.join(root,'404.html'); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(file).on('error',()=>{if(!res.headersSent)res.statusCode=503;res.end('Recurso indisponível')}).pipe(res);
}).listen(Number(process.argv[2]) || 4181, '127.0.0.1', () => console.log('FR public preview on http://127.0.0.1:' + (process.argv[2] || 4181) + ' — root: ' + root));
