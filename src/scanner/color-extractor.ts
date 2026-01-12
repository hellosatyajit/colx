import { readFile } from 'fs/promises';

export interface ColorOccurrence {
  file: string;
  line: number;
  className: string;
  originalValue: string;
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
}

// Tailwind utility prefixes that support color arbitrary values
const COLOR_PREFIXES = [
  'bg', 'text', 'border', 'ring', 'outline', 'divide', 'from', 'via', 'to',
  'decoration', 'accent', 'caret', 'fill', 'stroke', 'shadow'
];

// Build regex pattern for all color prefixes
const prefixPattern = COLOR_PREFIXES.join('|');

// Hex color pattern: bg-[#ff5733], text-[#ABC]
const hexPattern = new RegExp(
  `(?:${prefixPattern})-\\[#([0-9a-fA-F]{3,8})\\]`,
  'g'
);

// RGB pattern: bg-[rgb(255,87,51)]
const rgbPattern = new RegExp(
  `(?:${prefixPattern})-\\[rgb\\(([^)]+)\\)\\]`,
  'g'
);

// RGBA pattern: bg-[rgba(255,87,51,0.5)]
const rgbaPattern = new RegExp(
  `(?:${prefixPattern})-\\[rgba\\(([^)]+)\\)\\]`,
  'g'
);

// HSL pattern: bg-[hsl(9,100%,50%)]
const hslPattern = new RegExp(
  `(?:${prefixPattern})-\\[hsl\\(([^)]+)\\)\\]`,
  'g'
);

// HSLA pattern: bg-[hsla(9,100%,50%,0.5)]
const hslaPattern = new RegExp(
  `(?:${prefixPattern})-\\[hsla\\(([^)]+)\\)\\]`,
  'g'
);

export async function extractColorsFromFile(filePath: string): Promise<ColorOccurrence[]> {
  const occurrences: ColorOccurrence[] = [];
  
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract hex colors
    let match;
    while ((match = hexPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      occurrences.push({
        file: filePath,
        line: lineNumber,
        className: match[0],
        originalValue: `#${match[1]}`,
        format: 'hex'
      });
    }

    // Extract RGB colors
    while ((match = rgbPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      occurrences.push({
        file: filePath,
        line: lineNumber,
        className: match[0],
        originalValue: `rgb(${match[1]})`,
        format: 'rgb'
      });
    }

    // Extract RGBA colors
    while ((match = rgbaPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      occurrences.push({
        file: filePath,
        line: lineNumber,
        className: match[0],
        originalValue: `rgba(${match[1]})`,
        format: 'rgba'
      });
    }

    // Extract HSL colors
    while ((match = hslPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      occurrences.push({
        file: filePath,
        line: lineNumber,
        className: match[0],
        originalValue: `hsl(${match[1]})`,
        format: 'hsl'
      });
    }

    // Extract HSLA colors
    while ((match = hslaPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      occurrences.push({
        file: filePath,
        line: lineNumber,
        className: match[0],
        originalValue: `hsla(${match[1]})`,
        format: 'hsla'
      });
    }
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error}`);
  }

  return occurrences;
}

export async function extractColorsFromFiles(filePaths: string[]): Promise<ColorOccurrence[]> {
  const allOccurrences: ColorOccurrence[] = [];

  for (const filePath of filePaths) {
    const occurrences = await extractColorsFromFile(filePath);
    allOccurrences.push(...occurrences);
  }

  return allOccurrences;
}
