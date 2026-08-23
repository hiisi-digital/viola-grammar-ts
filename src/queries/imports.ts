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

; Re-exports, which are imports for every purpose a lint cares about.
; \`export { thing } from "./mod.ts"\` names a symbol and pulls it from another
; module, and a barrel that re-exports its package's surface is the strongest
; evidence a symbol is public. Without this the orphaned-code lint reported
; every re-exported symbol as never imported, which is every public symbol in
; a package built around a \`mod.ts\`.
(export_statement
  (export_clause
    (export_specifier
      name: (identifier) @import.name
      alias: (identifier)? @import.alias))
  source: (string) @import.from) @import

; \`export * from "./mod.ts"\`, which names no symbol but still uses the module.
(export_statement
  source: (string) @import.from) @import
`;
