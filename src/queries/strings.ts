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

; Template literals.
;
; The node is captured for structure and its fragment for the value, and only
; the fragment carries @string.value. Capturing both as the value matched the
; same template twice, so every template literal in a codebase was reported as
; appearing twice as often as it does, at the same line number.
(template_string) @string.template

; Raw template string content
(template_string
  (string_fragment)? @string.value)
`;
