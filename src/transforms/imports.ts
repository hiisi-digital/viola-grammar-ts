/**
 * Import statement parsing utilities for TypeScript.
 *
 * Handles:
 * - Default imports
 * - Named imports with renaming
 * - Namespace imports
 * - Type-only imports
 * - Side-effect imports
 *
 * @module
 */

import type { QueryCaptures, SyntaxNode } from "@hiisi/viola/grammars";
import type { ImportInfo } from "@hiisi/viola/data";

/**
 * Parse import statement from tree-sitter node.
 *
 * @param node - The import statement node
 * @param captures - Query captures from the match
 * @param source - Full source code string
 * @returns Parsed import information (single or array)
 *
 * @example
 * ```ts
 * parseImport(importNode, captures, sourceCode);
 * // Returns: {
 * //   name: "useState",
 * //   from: "react",
 * //   location: { file: "app.ts", line: 1, column: 0 },
 * //   isTypeOnly: false,
 * //   isNamespace: false
 * // }
 * ```
 */
export function parseImport(
  node: SyntaxNode,
  captures: QueryCaptures,
  source: string,
): ImportInfo | ImportInfo[] {
  // TODO: Implement import parsing
  // For now, return minimal import info
  return {
    name: "",
    from: "",
    location: {
      file: "",
      line: node.startPosition.row + 1,
      column: node.startPosition.column,
    },
    isTypeOnly: false,
    isNamespace: false,
  };
}
