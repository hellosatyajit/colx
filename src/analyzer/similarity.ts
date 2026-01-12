import chroma from 'chroma-js';

export interface SimilarColorGroup {
  colors: string[];
  suggestedColor: string;
  averageSimilarity: number;
}

/**
 * Calculate Delta E (CIEDE2000) color difference
 * Lower values mean colors are more similar
 */
function calculateDeltaE(color1: string, color2: string): number {
  try {
    const c1 = chroma(color1);
    const c2 = chroma(color2);
    
    // Get LAB values for Delta E calculation
    const lab1 = c1.lab();
    const lab2 = c2.lab();
    
    // Simple Delta E calculation (Euclidean distance in LAB space)
    // For more accurate CIEDE2000, we'd need a specialized library
    const deltaL = lab1[0] - lab2[0];
    const deltaA = lab1[1] - lab2[1];
    const deltaB = lab1[2] - lab2[2];
    
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  } catch (error) {
    return Infinity; // Colors are very different if we can't compare
  }
}

/**
 * Find similar color groups using Delta E threshold
 */
export function findSimilarColors(
  colors: string[],
  threshold: number = 5
): SimilarColorGroup[] {
  if (colors.length === 0) return [];

  const groups: SimilarColorGroup[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < colors.length; i++) {
    const color1 = colors[i];
    if (processed.has(color1)) continue;

    const similarColors = [color1];
    const similarities: number[] = [];

    // Find all colors similar to color1
    for (let j = i + 1; j < colors.length; j++) {
      const color2 = colors[j];
      if (processed.has(color2)) continue;

      const deltaE = calculateDeltaE(color1, color2);
      if (deltaE <= threshold) {
        similarColors.push(color2);
        similarities.push(deltaE);
        processed.add(color2);
      }
    }

    if (similarColors.length > 1) {
      // Calculate average similarity
      const avgSimilarity = similarities.length > 0
        ? similarities.reduce((a, b) => a + b, 0) / similarities.length
        : 0;

      // Suggest the first color as the merge target (could be improved with better logic)
      groups.push({
        colors: similarColors,
        suggestedColor: color1,
        averageSimilarity: avgSimilarity
      });
    }

    processed.add(color1);
  }

  return groups;
}
