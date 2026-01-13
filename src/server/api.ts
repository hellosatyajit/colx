import { Express, Request, Response } from 'express';
import { ColorOccurrence } from '../scanner/color-extractor';
import { ParsedColor, parseColor } from '../analyzer/color-parser';
import { SimilarColorGroup } from '../analyzer/similarity';
import { CSSVariableSuggestion } from '../analyzer/consolidator';

export interface ColorData {
  id: string;
  hex: string;
  originalValue: string;
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  occurrences: Array<{
    file: string;
    line: number;
    className: string;
  }>;
}

export interface SuggestionsResponse {
  cssVariables: CSSVariableSuggestion[];
  merges: Array<{
    colors: string[];
    suggestedColor: string;
    similarity: number;
  }>;
}

export interface StatsResponse {
  totalOccurrences: number;
  uniqueColors: number;
  filesScanned: number;
  formats: Record<string, number>;
}

let colorDataCache: ColorData[] = [];
let suggestionsCache: SuggestionsResponse | null = null;
let statsCache: StatsResponse | null = null;
let watchModeEnabled: boolean = false;

export function setColorData(
  occurrences: ColorOccurrence[],
  parsedColors: Map<string, ParsedColor>,
  similarGroups: SimilarColorGroup[],
  cssVariables: CSSVariableSuggestion[]
) {
  // Group occurrences by hex color
  const colorMap = new Map<string, ColorData>();

  for (const occurrence of occurrences) {
    // Parse the color to get its hex value
    const parsed = parseColor(occurrence.originalValue, occurrence.format);
    
    if (parsed) {
      const hex = parsed.hex;
      
      if (!colorMap.has(hex)) {
        colorMap.set(hex, {
          id: hex,
          hex,
          originalValue: parsed.originalValue,
          format: parsed.format,
          occurrences: []
        });
      }

      colorMap.get(hex)!.occurrences.push({
        file: occurrence.file,
        line: occurrence.line,
        className: occurrence.className
      });
    }
  }

  colorDataCache = Array.from(colorMap.values());

  // Build suggestions
  suggestionsCache = {
    cssVariables,
    merges: similarGroups.map(group => ({
      colors: group.colors,
      suggestedColor: group.suggestedColor,
      similarity: group.averageSimilarity
    }))
  };

  // Build stats
  const uniqueFiles = new Set(occurrences.map(o => o.file));
  const formatCounts: Record<string, number> = {};
  
  for (const occurrence of occurrences) {
    formatCounts[occurrence.format] = (formatCounts[occurrence.format] || 0) + 1;
  }

  statsCache = {
    totalOccurrences: occurrences.length,
    uniqueColors: colorDataCache.length,
    filesScanned: uniqueFiles.size,
    formats: formatCounts
  };
}

export function setWatchMode(enabled: boolean) {
  watchModeEnabled = enabled;
}

export function setupApiRoutes(app: Express) {
  app.get('/api/colors', (_req: Request, res: Response) => {
    res.json(colorDataCache);
  });

  app.get('/api/suggestions', (_req: Request, res: Response) => {
    res.json(suggestionsCache || { cssVariables: [], merges: [] });
  });

  app.get('/api/stats', (_req: Request, res: Response) => {
    res.json(statsCache || {
      totalOccurrences: 0,
      uniqueColors: 0,
      filesScanned: 0,
      formats: {}
    });
  });

  app.get('/api/watch-mode', (_req: Request, res: Response) => {
    res.json({ enabled: watchModeEnabled });
  });
}
