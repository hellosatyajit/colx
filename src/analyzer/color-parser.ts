import chroma from 'chroma-js';

export interface ParsedColor {
  hex: string;
  originalValue: string;
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
}

/**
 * Normalize a color value to hex format
 * Handles hex, rgb, rgba, hsl, and hsla formats
 */
export function parseColor(value: string, format: ParsedColor['format']): ParsedColor | null {
  try {
    let chromaColor: chroma.Color;

    switch (format) {
      case 'hex':
        // Handle 3-digit hex (#ABC -> #AABBCC)
        if (value.length === 4) {
          value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
        }
        chromaColor = chroma(value);
        break;

      case 'rgb':
        chromaColor = chroma(`rgb(${value})`);
        break;

      case 'rgba':
        chromaColor = chroma(`rgba(${value})`);
        break;

      case 'hsl':
        chromaColor = chroma(`hsl(${value})`);
        break;

      case 'hsla':
        chromaColor = chroma(`hsla(${value})`);
        break;

      default:
        return null;
    }

    // Normalize to hex (uppercase, no alpha)
    const hex = chromaColor.hex().toUpperCase();

    return {
      hex,
      originalValue: value,
      format
    };
  } catch (error) {
    // Invalid color format
    return null;
  }
}

/**
 * Parse multiple color values and return unique parsed colors
 */
export function parseColors(
  occurrences: Array<{ originalValue: string; format: ParsedColor['format'] }>
): Map<string, ParsedColor> {
  const colorMap = new Map<string, ParsedColor>();

  for (const occurrence of occurrences) {
    const parsed = parseColor(occurrence.originalValue, occurrence.format);
    if (parsed) {
      // Use hex as the key to deduplicate
      if (!colorMap.has(parsed.hex)) {
        colorMap.set(parsed.hex, parsed);
      }
    }
  }

  return colorMap;
}
