// Local test server that behaves like the Vercel setup: clean URLs (/contact -> contact.html),
// 404.html for missing pages, no caching.   node serve.js <site folder> <port>
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(process.argv[2] || '.'), port = +process.argv[3] || 8080;
const types = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.woff2':'font/woff2','.mp3':'audio/mpeg','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain'};
const send = (res, status, f) => fs.readFile(f, (e, d) => {
  if (e) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(status, {'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
  res.end(d);
});
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  const candidates = path.extname(f) ? [f] : [f, f + '.html'];
  const hit = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (hit) return send(res, 200, hit);
  send(res, 404, path.join(root, '404.html'));
}).listen(port, () => console.log('Serving ' + root + ' on http://localhost:' + port));
