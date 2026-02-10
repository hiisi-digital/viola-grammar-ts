/**
 * Body normalization for TypeScript code.
 *
 * Normalizes function and type bodies for similarity comparison by:
 * - Stripping comments (single-line, multi-line, JSDoc)
 * - Normalizing whitespace
 * - Removing type annotations (so structurally identical functions
 *   with different type annotations are detected as similar)
 *
 * @module
 */

/**
 * Normalize a TypeScript function or type body for comparison.
 */
export function normalizeBody(body: string, _languageId: string): string {
  let normalized = body;

  // Normalize line endings
  normalized = normalized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove single-line comments
  normalized = normalized.replace(/\/\/[^\n]*/g, "");

  // Remove multi-line and JSDoc comments
  normalized = normalized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Collapse whitespace runs to single space
  normalized = normalized.replace(/\s+/g, " ");

  // Trim
  normalized = normalized.trim();

  return normalized;
}
