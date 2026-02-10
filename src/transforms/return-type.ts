/**
 * Return type extraction for TypeScript functions.
 *
 * Extracts return type annotations from function declarations,
 * arrow functions, and method definitions.
 *
 * @module
 */

import type { QueryCaptures, SyntaxNode } from "@hiisi/viola/grammars";

/**
 * Extract the return type annotation from a function node.
 *
 * Checks for a `return_type` or `type_annotation` field on the node,
 * falling back to the query capture `@function.return`.
 */
export function extractReturnType(
  node: SyntaxNode,
  captures: QueryCaptures,
): string | undefined {
  // Check query capture first
  const returnCapture = captures.get("function.return");
  if (returnCapture) {
    return cleanTypeAnnotation(returnCapture.text);
  }

  // Walk the function node to find return type annotation
  const typeAnnotation = node.childForFieldName("return_type");
  if (typeAnnotation) {
    return cleanTypeAnnotation(typeAnnotation.text);
  }

  return undefined;
}

/**
 * Strip leading colon and whitespace from a type annotation.
 */
function cleanTypeAnnotation(text: string): string {
  return text.replace(/^\s*:\s*/, "").trim();
}
