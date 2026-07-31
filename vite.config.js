import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const plugins = [];

  // Solo inyectar la API localmente durante el desarrollo (npm run dev)
  // En Vercel (producción), las Serverless Functions manejan la API automáticamente
  if (command === 'serve') {
    plugins.push({
      name: 'api-server',
      async configureServer(server) {
        // Cargar el archivo de forma dinámica solo en local
        const mod = await import('./api/artworks.js');
        const artworksApi = mod.default || mod;

        server.middlewares.use('/api/artworks', (req, res, next) => {
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
            const url = new URL(req.originalUrl || req.url, `http://${req.headers.host}`);
            req.query = Object.fromEntries(url.searchParams);
            artworksApi(req, res);
          }
        });
      }
    });
  }

  return {
    server: {
      port: 5188
    },
    plugins
  };
});
