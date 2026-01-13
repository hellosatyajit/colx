import polka from 'polka';
import sirv from 'sirv';
import { join } from 'path';
import { readFileSync } from 'fs';
import { setupApiRoutes } from './api';
import open from 'open';

export function createServer(port: number = 6969, uiDir: string) {
  const app = polka();

  // Serve static files from UI directory
  app.use(sirv(uiDir, {
    dev: false,
    single: false
  }));

  // Setup API routes
  setupApiRoutes(app);

  // Fallback to index.html for SPA routing
  app.get('*', (_req, res) => {
    try {
      const html = readFileSync(join(uiDir, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return app;
}

export async function startServer(
  port: number = 6969,
  uiDir: string,
  shouldOpen: boolean = true
): Promise<void> {
  const app = createServer(port, uiDir);

  return new Promise((resolve) => {
    app.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`\n🚀 Server running at ${url}`);
      console.log(`📊 Open your browser to view the color visualizer\n`);

      if (shouldOpen) {
        open(url).catch((err) => {
          console.warn(`Could not open browser automatically: ${err}`);
          console.log(`Please open ${url} manually`);
        });
      }

      resolve();
    });
  });
}
