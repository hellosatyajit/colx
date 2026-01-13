import chokidar, { FSWatcher } from 'chokidar';
import { findTsxJsxFiles } from './file-walker';
import { extractColorsFromFiles } from './color-extractor';
import { parseColors } from '../analyzer/color-parser';
import { findSimilarColors } from '../analyzer/similarity';
import { consolidateToCSSVariables } from '../analyzer/consolidator';
import { setColorData } from '../server/api';

let rescanTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 500; // Wait 500ms after last change before rescanning

export async function watchAndRescan(
  targetDir: string,
  threshold: number
): Promise<FSWatcher> {
  const watcher = chokidar.watch(targetDir, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**'
    ],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100
    }
  });

  const rescan = async () => {
    // Clear existing timeout
    if (rescanTimeout) {
      clearTimeout(rescanTimeout);
    }

    // Debounce: wait for file changes to settle
    rescanTimeout = setTimeout(async () => {
      console.log('\n🔄 Files changed, rescanning...');
      try {
        const files = await findTsxJsxFiles(targetDir);
        
        if (files.length === 0) {
          console.log('   No .tsx or .jsx files found.');
          return;
        }

        const occurrences = await extractColorsFromFiles(files);
        
        if (occurrences.length === 0) {
          console.log('   No Tailwind arbitrary color values found.');
          setColorData([], new Map(), [], []);
          return;
        }

        const parsedColors = parseColors(
          occurrences.map(occ => ({
            originalValue: occ.originalValue,
            format: occ.format
          }))
        );
        
        const uniqueHexColors = Array.from(parsedColors.keys());
        const similarGroups = findSimilarColors(uniqueHexColors, threshold);
        const cssVariables = consolidateToCSSVariables(occurrences);
        
        setColorData(occurrences, parsedColors, similarGroups, cssVariables);
        
        console.log(`✅ Updated: ${occurrences.length} color occurrence${occurrences.length !== 1 ? 's' : ''}, ${parsedColors.size} unique color${parsedColors.size !== 1 ? 's' : ''}`);
      } catch (error) {
        console.error('❌ Error rescanning:', error instanceof Error ? error.message : String(error));
      }
    }, DEBOUNCE_DELAY);
  };

  watcher.on('change', (path) => {
    if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
      rescan();
    }
  });

  watcher.on('add', (path) => {
    if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
      rescan();
    }
  });

  watcher.on('unlink', (path) => {
    if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
      rescan();
    }
  });

  return watcher;
}
