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

import type { SyntaxNode } from "@hiisi/viola/grammars";

/**
 * Parse JSDoc comment into cleaned string.
 *
 * Strips comment delimiters and extracts the main content.
 *
 * @param node - The JSDoc comment node
 * @param source - Full source code string
 * @returns Cleaned comment string
 *
 * @example
 * ```ts
 * parseDocComment(commentNode, sourceCode);
 * // Returns: "Calculate sum.\n@param a - First number\n@param b - Second number\n@returns The sum"
 * ```
 */
export function parseDocComment(node: SyntaxNode, source: string): string {
  // TODO: Implement JSDoc parsing
  // For now, return the node text as-is
  return node.text;
}
