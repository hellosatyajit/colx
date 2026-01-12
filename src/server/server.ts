import express, { Express } from 'express';
import { join } from 'path';
import { setupApiRoutes } from './api';
import open from 'open';

export function createServer(port: number = 6969, uiDir: string): Express {
  const app = express();

  // Serve static files from UI directory
  app.use(express.static(uiDir));

  // Setup API routes
  setupApiRoutes(app);

  // Fallback to index.html for SPA routing
  app.get('*', (_req, res) => {
    res.sendFile(join(uiDir, 'index.html'));
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
