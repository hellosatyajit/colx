#!/usr/bin/env node

import { Command } from 'commander';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { findTsxJsxFiles } from './scanner/file-walker';
import { extractColorsFromFiles, ColorOccurrence } from './scanner/color-extractor';
import { parseColors, ParsedColor } from './analyzer/color-parser';
import { findSimilarColors, SimilarColorGroup } from './analyzer/similarity';
import { consolidateToCSSVariables, CSSVariableSuggestion } from './analyzer/consolidator';
import { startServer } from './server/server';
import { setColorData } from './server/api';

function findUiDirectory(): string {
  // Try multiple possible paths
  const possiblePaths = [
    // Development (running from src/)
    resolve(__dirname, 'ui'),
    // Production (running from dist/)
    resolve(__dirname, '../src/ui'),
    // Installed package
    resolve(__dirname, '../../src/ui'),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path) && existsSync(join(path, 'index.html'))) {
      return path;
    }
  }

  // Fallback to first path
  return possiblePaths[0];
}

const program = new Command();

program
  .name('tailwind-color-visualizer')
  .description('Scan and visualize Tailwind arbitrary color values')
  .version('1.0.0')
  .argument('[directory]', 'Directory to scan (default: current directory)', process.cwd())
  .option('-p, --port <number>', 'Server port', '6969')
  .option('--no-open', 'Do not open browser automatically')
  .option('-t, --threshold <number>', 'Color similarity threshold (Delta E)', '5')
  .action(async (directory: string, options: { port: string; open: boolean; threshold: string }) => {
    const targetDir = resolve(directory);
    const port = parseInt(options.port, 10);
    const threshold = parseFloat(options.threshold);
    const shouldOpen = options.open !== false;

    console.log('🔍 Scanning for Tailwind arbitrary color values...\n');
    console.log(`📁 Directory: ${targetDir}`);
    console.log(`🎨 Similarity threshold: ${threshold}`);
    console.log('');

    try {
      // Phase 1: Find and scan files
      console.log('📂 Finding .tsx and .jsx files...');
      const files = await findTsxJsxFiles(targetDir);
      console.log(`   Found ${files.length} file${files.length !== 1 ? 's' : ''}`);

      if (files.length === 0) {
        console.log('\n⚠️  No .tsx or .jsx files found in the specified directory.');
        process.exit(1);
      }

      // Phase 2: Extract colors
      console.log('\n🎨 Extracting color values...');
      const occurrences = await extractColorsFromFiles(files);
      console.log(`   Found ${occurrences.length} color occurrence${occurrences.length !== 1 ? 's' : ''}`);

      if (occurrences.length === 0) {
        console.log('\n⚠️  No Tailwind arbitrary color values found.');
        process.exit(1);
      }

      // Phase 3: Parse and normalize colors
      console.log('\n🔬 Parsing and normalizing colors...');
      const parsedColors = parseColors(
        occurrences.map(occ => ({
          originalValue: occ.originalValue,
          format: occ.format
        }))
      );
      console.log(`   Found ${parsedColors.size} unique color${parsedColors.size !== 1 ? 's' : ''}`);

      // Phase 4: Analyze similarities
      console.log('\n🔍 Analyzing color similarities...');
      const uniqueHexColors = Array.from(parsedColors.keys());
      const similarGroups = findSimilarColors(uniqueHexColors, threshold);
      console.log(`   Found ${similarGroups.length} group${similarGroups.length !== 1 ? 's' : ''} of similar colors`);

      // Phase 5: Generate CSS variable suggestions
      console.log('\n💡 Generating CSS variable suggestions...');
      const cssVariables = consolidateToCSSVariables(occurrences);
      console.log(`   Generated ${cssVariables.length} CSS variable suggestion${cssVariables.length !== 1 ? 's' : ''}`);

      // Phase 6: Setup API data
      setColorData(occurrences, parsedColors, similarGroups, cssVariables);

      // Phase 7: Start server
      console.log('\n🚀 Starting web server...');
      const uiDir = findUiDirectory();
      await startServer(port, uiDir, shouldOpen);

      // Keep the process alive
      process.on('SIGINT', () => {
        console.log('\n\n👋 Shutting down...');
        process.exit(0);
      });
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
