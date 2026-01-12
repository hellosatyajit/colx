import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', '.turbo'];

export async function findTsxJsxFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  const visited = new Set<string>();

  async function walk(dir: string): Promise<void> {
    const normalizedPath = join(dir);
    
    // Avoid infinite loops and excluded directories
    if (visited.has(normalizedPath)) return;
    visited.add(normalizedPath);

    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const normalizedFullPath = join(fullPath);

        if (entry.isDirectory()) {
          // Skip excluded directories
          if (!EXCLUDED_DIRS.includes(entry.name)) {
            await walk(normalizedFullPath);
          }
        } else if (entry.isFile()) {
          // Check for .tsx or .jsx extension
          if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
            files.push(normalizedFullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read (permissions, etc.)
      if ((error as NodeJS.ErrnoException).code !== 'EACCES') {
        console.warn(`Warning: Could not read directory ${dir}: ${error}`);
      }
    }
  }

  await walk(rootDir);
  return files;
}
