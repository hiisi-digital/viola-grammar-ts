/**
 * Tree-sitter queries for extracting string literals from TypeScript/JavaScript.
 *
 * Captures:
 * - String literals (single/double quotes)
 * - Template literals
 * - Template literal expressions
 *
 * Uses standard Viola capture naming:
 * - @string.value - String content
 * - @string.template - Template literal marker
 *
 * @module
 */

/**
 * Tree-sitter query for extracting strings from TypeScript/JavaScript.
 *
 * Handles:
 * - String literals with single or double quotes
 * - Template literals (backticks)
 * - Template literal expressions
 */
export const stringQueries = `
; String literals (single/double quotes)
(string
  (string_fragment)? @string.value) @string

; Template literals
(template_string) @string.value @string.template

; Raw template string content
(template_string
  (string_fragment)? @string.value)
`;
