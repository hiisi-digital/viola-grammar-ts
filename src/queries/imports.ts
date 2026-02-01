/**
 * Tree-sitter queries for extracting import statements from TypeScript/JavaScript.
 *
 * Captures:
 * - Default imports
 * - Named imports
 * - Namespace imports (import * as)
 * - Type-only imports (import type)
 * - Side-effect imports (import "module")
 *
 * Uses standard Viola capture naming:
 * - @import.name - Imported identifier
 * - @import.from - Source module path
 * - @import.type_only - Type-only import marker
 * - @import - Entire import statement
 *
 * @module
 */

/**
 * Tree-sitter query for extracting imports from TypeScript/JavaScript.
 *
 * Handles:
 * - Default imports: import foo from "module"
 * - Named imports: import { bar } from "module"
 * - Renamed imports: import { baz as qux } from "module"
 * - Namespace imports: import * as ns from "module"
 * - Type-only imports: import type { T } from "module"
 * - Inline type imports: import { type T } from "module"
 * - Side-effect imports: import "module"
 */
export const importQueries = `
; Import statements
(import_statement
  (import_clause
    (identifier)? @import.name
    (named_imports
      (import_specifier
        name: (identifier) @import.name
        alias: (identifier)? @import.alias))*
    (namespace_import
      (identifier) @import.name)?)?
  source: (string) @import.from) @import

; Type-only imports
(import_statement
  "type"
  (import_clause
    (identifier)? @import.name
    (named_imports
      (import_specifier
        name: (identifier) @import.name))*)?
  source: (string) @import.from) @import @import.type_only

; Side-effect imports
(import_statement
  source: (string) @import.from) @import
`;
