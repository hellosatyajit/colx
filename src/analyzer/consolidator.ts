import { ColorOccurrence } from '../scanner/color-extractor';
import { parseColors, ParsedColor } from './color-parser';

export interface CSSVariableSuggestion {
  variable: string;
  value: string;
  occurrences: number;
  files: string[];
  hex: string;
}

/**
 * Generate CSS variable name from color value or usage
 */
function generateVariableName(hex: string, index: number): string {
  // Try to generate semantic names based on color properties
  // For now, use generic names like --color-primary, --color-accent, etc.
  const names = [
    'primary',
    'secondary',
    'accent',
    'background',
    'foreground',
    'muted',
    'border',
    'ring',
    'shadow'
  ];

  if (index < names.length) {
    return `--color-${names[index]}`;
  }

  // Fallback to indexed names
  return `--color-${index + 1}`;
}

/**
 * Consolidate duplicate colors into CSS variable suggestions
 */
export function consolidateToCSSVariables(
  occurrences: ColorOccurrence[]
): CSSVariableSuggestion[] {
  // Group occurrences by hex value
  const hexGroups = new Map<string, {
    occurrences: ColorOccurrence[];
    parsed: ParsedColor;
  }>();

  for (const occurrence of occurrences) {
    // Parse the color to get its hex value
    const parsedMap = parseColors([{
      originalValue: occurrence.originalValue,
      format: occurrence.format
    }]);
    
    // Get the parsed color (should only be one)
    const parsed = Array.from(parsedMap.values())[0];
    
    if (parsed) {
      const hex = parsed.hex;
      if (!hexGroups.has(hex)) {
        hexGroups.set(hex, {
          occurrences: [],
          parsed
        });
      }
      hexGroups.get(hex)!.occurrences.push(occurrence);
    }
  }

  // Generate suggestions for colors that appear multiple times
  const suggestions: CSSVariableSuggestion[] = [];
  let variableIndex = 0;

  for (const [hex, group] of hexGroups.entries()) {
    if (group.occurrences.length > 1) {
      const uniqueFiles = [...new Set(group.occurrences.map(o => o.file))];
      
      suggestions.push({
        variable: generateVariableName(hex, variableIndex),
        value: group.parsed.originalValue,
        occurrences: group.occurrences.length,
        files: uniqueFiles,
        hex
      });
      
      variableIndex++;
    }
  }

  // Sort by occurrences (most used first)
  return suggestions.sort((a, b) => b.occurrences - a.occurrences);
}
