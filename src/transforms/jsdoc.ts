/**
 * JSDoc comment parsing utilities.
 *
 * Extracts structured information from JSDoc comments:
 * - Description text
 * - @param tags with names and descriptions
 * - @returns description
 * - @deprecated message
 * - @example code blocks
 * - @throws/@throws tags
 *
 * @module
 */

/**
 * Parsed JSDoc parameter tag.
 */
export interface JSDocParam {
  /** Parameter name */
  name: string;
  /** Parameter type if specified */
  type?: string;
  /** Parameter description */
  description: string;
}

/**
 * Parsed JSDoc information.
 */
export interface ParsedJSDoc {
  /** Main description */
  description: string;
  /** @param tags */
  params?: JSDocParam[];
  /** @returns description */
  returns?: string;
  /** @deprecated message */
  deprecated?: string;
  /** @example blocks */
  examples?: string[];
  /** @throws descriptions */
  throws?: string[];
  /** Other tags */
  tags?: Record<string, string>;
}

/**
 * Parse JSDoc comment into structured data.
 *
 * Strips comment delimiters and extracts tags with their content.
 *
 * @param comment - The raw JSDoc comment string
 * @returns Parsed JSDoc information
 *
 * @example
 * ```ts
 * parseDocComment(`/**
 *  * Calculate sum.
 *  * @param a - First number
 *  * @param b - Second number
 *  * @returns The sum
 *  *\/`);
 * // Returns: {
 * //   description: "Calculate sum.",
 * //   params: [
 * //     { name: "a", description: "First number" },
 * //     { name: "b", description: "Second number" }
 * //   ],
 * //   returns: "The sum"
 * // }
 * ```
 */
export function parseDocComment(comment: unknown): ParsedJSDoc {
  // TODO: Implement JSDoc parsing
  // For now, return minimal structure
  return {
    description: typeof comment === "string" ? comment : "",
  };
}
