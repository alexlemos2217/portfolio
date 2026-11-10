const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const portOption = process.argv.find(value => value.startsWith('--port='));
const port = portOption ? Number(portOption.slice(7)) : 4173;
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');
const compressed = new Map();
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer((req,res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (file === root) file = path.join(root,'index.html');
  if (!file.startsWith(root + path.sep) || path.relative(root,file).split(path.sep).some(p => p.startsWith('.'))) { res.writeHead(403).end(); return; }
  fs.readFile(file,(error,data) => {
    if(error){res.writeHead(404).end('Not found');return;}
    const extension = path.extname(file);
    const headers = {'Content-Type':types[extension]||'application/octet-stream','Cache-Control':'no-cache','Vary':'Accept-Encoding'};
    if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && ['.html','.css','.js','.svg'].includes(extension)) {
      const mtime = fs.statSync(file).mtimeMs;
      let cached = compressed.get(file);
      if (!cached || cached.mtime !== mtime) { cached = {mtime, data: zlib.gzipSync(data)}; compressed.set(file,cached); }
      data = cached.data;
      headers['Content-Encoding'] = 'gzip';
    }
    res.writeHead(200,headers).end(data);
  });
}).listen(port,'127.0.0.1',()=> console.log(`Portfolio: http://127.0.0.1:${port}`));
