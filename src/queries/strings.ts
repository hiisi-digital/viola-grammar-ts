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
; Only the fragment carries @string.value. Capturing the node as the value too
; matched the same template twice, so every template literal was reported as
; appearing twice as often as it does, at the same line number.
;
; The template marker sits on this same pattern rather than on a pattern of its
; own. Split across two patterns it arrived in a different match from the
; fragment, so a fragment came back marked as not a template and could not be
; told apart from an ordinary string. A leading fragment such as Found then
; read as a repeated literal across every message starting that way, and the
; remedy offered, a shared constant, is not one for half a sentence.
(template_string
  (string_fragment)? @string.value) @string.template
`;
