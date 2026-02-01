/**
 * Tree-sitter queries for extracting JSDoc comments from TypeScript/JavaScript.
 *
 * Captures:
 * - JSDoc block comments
 * - Multi-line comments
 *
 * Uses standard Viola capture naming:
 * - @doc.content - JSDoc comment content
 *
 * @module
 */

/**
 * Tree-sitter query for extracting documentation comments.
 *
 * Handles:
 * - JSDoc comments
 * - Regular multi-line comments that precede declarations
 */
export const docCommentQueries = `
; JSDoc comments
(comment) @doc.content
`;
