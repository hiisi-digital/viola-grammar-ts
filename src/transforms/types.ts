/**
 * Type field parsing utilities for TypeScript interfaces and types.
 *
 * Extracts field information from:
 * - Interface members
 * - Type alias object fields
 * - Method signatures
 *
 * @module
 */

import type { SyntaxNode } from "@hiisi/viola/grammars";
import type { TypeField } from "@hiisi/viola/data";

/**
 * Parse fields from TypeScript interface or type body.
 *
 * @param bodyNode - The type body node from tree-sitter
 * @param source - Full source code string
 * @returns Array of parsed field information
 *
 * @example
 * ```ts
 * parseTypeFields(interfaceBody, sourceCode);
 * // Returns: [
 * //   { name: "id", type: "number", optional: false },
 * //   { name: "name", type: "string", optional: false },
 * //   { name: "email", type: "string", optional: true }
 * // ]
 * ```
 */
export function parseTypeFields(
  bodyNode: SyntaxNode | undefined,
  source: string,
): TypeField[] {
  // TODO: Implement type field parsing
  // For now, return empty array
  return [];
}
