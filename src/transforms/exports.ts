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

  let current: SyntaxNode | null = node;
  // Walk up to check for an export_statement ancestor, stopping at a class
  // body.
  //
  // A class member is not itself an export. Its visibility comes from the
  // class, and `constructor` is not a name anybody can import. Walking past
  // the class body found the `export` on `export class Foo` and reported every
  // method as an exported function, so missing-docs demanded JSDoc on each
  // constructor and same-name-different-params reported "constructor exists in
  // multiple files with DIFFERENT signatures", which is what a constructor is.
  while (current) {
    if (current.type === "class_body") return false;
    if (current.type === "export_statement") return true;
    current = current.parent;
  }

  return false;
}
