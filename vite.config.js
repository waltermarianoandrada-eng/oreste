import { defineConfig } from 'vite';
import artworksApi from './api/artworks.js';

export default defineConfig({
  server: {
    port: 5188
  },
  plugins: [
    {
      name: 'api-server',
      configureServer(server) {
        server.middlewares.use('/api/artworks', (req, res, next) => {
          // Helper methods to simulate Vercel/Express response
          res.status = function(code) {
            res.statusCode = code;
            return res;
          };
          res.json = function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              if (body) {
                req.body = JSON.parse(body);
              }
              artworksApi(req, res);
            });
          } else {
            // For GET and DELETE, parse query parameters
            const url = new URL(req.originalUrl || req.url, `http://${req.headers.host}`);
            req.query = Object.fromEntries(url.searchParams);
            artworksApi(req, res);
          }
        });
      }
    }
  ]
});
