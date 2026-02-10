/**
 * Tree-sitter queries for extracting export statements from TypeScript/JavaScript.
 *
 * Captures:
 * - Default exports
 * - Named exports
 * - Re-exports (export from)
 * - Export all (export * from)
 * - Type-only exports
 * - Declaration exports (export function, export class)
 *
 * Uses standard Viola capture naming:
 * - @export.name - Exported identifier
 * - @export.kind - Export kind (function, class, etc.)
 * - @export.from - Re-export source
 * - @export - Entire export statement
 *
 * @module
 */

/**
 * Tree-sitter query for extracting exports from TypeScript/JavaScript.
 *
 * Handles:
 * - Default exports: export default foo
 * - Named exports: export { bar }
 * - Renamed exports: export { baz as qux }
 * - Re-exports: export { x } from "module"
 * - Re-export all: export * from "module"
 * - Type-only exports: export type { T }
 * - Declaration exports: export function fn() {}
 * - Class exports: export class C {}
 */
export const exportQueries = `
; Export declarations (export function, export class, etc.)
(export_statement
  declaration: [
    (function_declaration
      name: (identifier) @export.name)
    (generator_function_declaration
      name: (identifier) @export.name)
    (class_declaration
      name: (type_identifier) @export.name)
    (abstract_class_declaration
      name: (type_identifier) @export.name)
    (lexical_declaration
      (variable_declarator
        name: (identifier) @export.name))
    (variable_declaration
      (variable_declarator
        name: (identifier) @export.name))
    (interface_declaration
      name: (type_identifier) @export.name)
    (type_alias_declaration
      name: (type_identifier) @export.name)
    (enum_declaration
      name: (identifier) @export.name)
  ]) @export

; Named exports: export { foo, bar }
(export_statement
  (export_clause
    (export_specifier
      name: (identifier) @export.name
      alias: (identifier)? @export.alias))) @export

; Default exports
(export_statement
  "default"
  value: [
    (identifier) @export.name
    (function_expression)
    (class)
    (arrow_function)
  ]) @export

; Re-exports: export { x } from "module"
(export_statement
  (export_clause
    (export_specifier
      name: (identifier) @export.name))?
  source: (string) @export.from) @export

; Re-export all: export * from "module"
(export_statement
  "*"
  source: (string) @export.from) @export

; Re-export namespace: export * as ns from "module"
(export_statement
  "*"
  "as"
  (identifier) @export.name
  source: (string) @export.from) @export

; Type-only exports
(export_statement
  "type"
  (export_clause
    (export_specifier
      name: (identifier) @export.name))) @export @export.type_only
`;
