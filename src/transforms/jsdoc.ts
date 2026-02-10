/**
 * JSDoc/TSDoc comment parsing for TypeScript.
 *
 * Strips JSDoc markers and extracts clean documentation text.
 *
 * @module
 */

import type { SyntaxNode } from "@hiisi/viola/grammars";

/**
 * Parse a JSDoc comment node into clean documentation text.
 *
 * Strips opening/closing JSDoc markers and leading asterisks from each line.
 */
export function parseDocComment(node: SyntaxNode, _source: string): string {
  let text = node.text;

  // Strip opening /** and closing */
  text = text.replace(/^\/\*\*\s*/, "").replace(/\s*\*\/\s*$/, "");

  // Strip leading * on each line
  text = text
    .split("\n")
    .map(line => line.replace(/^\s*\*\s?/, ""))
    .join("\n");

  return text.trim();
}
