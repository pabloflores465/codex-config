/**
 * Codex → OpenRouter proxy
 * - HTTP: forwards to https://openrouter.ai/api
 * - WebSocket: accepts upgrade, closes with protocol error
 *   (instant HTTP fallback, no 5× retry delay)
 */
import http from 'node:http';
import https from 'node:https';
import { createHash } from 'node:crypto';

const PORT = 8009;
const API_KEY = 'YOUR_OPENROUTER_API_KEY_HERE';
const WS_MAGIC = '258EAFA5-E914-47DA-95CA-5AB1A2E9F580';

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    let path = req.url || '/';
    if (!path.startsWith('/v1')) path = '/v1' + path;

    const proxyReq = https.request({
      hostname: 'openrouter.ai', port: 443, path: `/api${path}`, method: req.method,
    }, (proxyRes) => { res.writeHead(proxyRes.statusCode, proxyRes.headers); proxyRes.pipe(res); });

    proxyReq.on('error', (e) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Proxy: ${e.message}` }));
      }
    });
    proxyReq.setHeader('Authorization', `Bearer ${API_KEY}`);
    proxyReq.setHeader('Content-Type', 'application/json');
    if (body.length) proxyReq.write(body);
    proxyReq.end();
  });
});

server.on('upgrade', (req, socket) => {
  const wsKey = req.headers['sec-websocket-key'] || '';
  const accept = createHash('sha1').update(wsKey + WS_MAGIC).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\n' +
    'Connection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  const closeFrame = Buffer.from([0x88, 0x02, 0x03, 0xea]);
  let closed = false;
  const doClose = () => {
    if (closed) return; closed = true;
    socket.write(closeFrame);
    setTimeout(() => socket.destroy(), 200);
  };
  socket.once('data', doClose);
  setTimeout(doClose, 1000);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Proxy: http://127.0.0.1:${PORT} → https://openrouter.ai/api`);
});
