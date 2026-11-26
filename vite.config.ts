import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import worker from './functions/worker';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-dev-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              const url = `http://${req.headers.host || 'localhost:3000'}${req.url}`;
              let body: string | undefined = undefined;

              if (req.method === 'POST' || req.method === 'PUT') {
                const chunks: any[] = [];
                for await (const chunk of req) {
                  chunks.push(chunk);
                }
                body = Buffer.concat(chunks).toString('utf-8');
              }

              const webReq = new Request(url, {
                method: req.method,
                headers: req.headers as any,
                body: body || undefined
              });

              const webRes = await worker.fetch(webReq, {
                SITE_URL: 'http://localhost:3000',
                EMERGENCY_STOP: 'false'
              });

              res.statusCode = webRes.status;
              webRes.headers.forEach((val, key) => {
                res.setHeader(key, val);
              });
              const text = await webRes.text();
              res.end(text);
              return;
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
