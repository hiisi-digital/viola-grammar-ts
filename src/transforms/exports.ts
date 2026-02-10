/**
 * Export detection for TypeScript nodes.
 *
 * Detects whether a function, class, or type node is exported
 * by checking its parent for an export_statement wrapper.
 *
 * @module
 */

import type { QueryCaptures, SyntaxNode } from "@hiisi/viola/grammars";

/**
 * Detect if a node is exported.
 *
 * Checks the query captures first (`@function.export` or `@export`),
 * then walks up the tree to find an `export_statement` parent.
 */
export function isExported(
  node: SyntaxNode,
  captures: QueryCaptures,
): boolean {
  // Check captures
  if (captures.has("function.export") || captures.has("export")) {
    return true;
  }

  // Walk up to check for export_statement ancestor
  let current: SyntaxNode | null = node;
  while (current) {
    if (current.type === "export_statement") return true;
    current = current.parent;
  }

  return false;
}
