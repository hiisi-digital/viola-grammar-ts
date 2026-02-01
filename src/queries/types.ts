/**
 * Tree-sitter queries for extracting type declarations from TypeScript.
 *
 * Captures:
 * - Interface declarations
 * - Type alias declarations
 * - Enum declarations
 *
 * Uses standard Viola capture naming:
 * - @type.name - Type/interface name
 * - @type.body - Type body
 * - @type.kind - type vs interface vs enum
 * - @type - Entire type declaration
 *
 * @module
 */

/**
 * Tree-sitter query for extracting types from TypeScript.
 *
 * Handles:
 * - Interface declarations
 * - Type alias declarations
 * - Enum declarations
 * - Generic type parameters
 * - Extends clauses
 */
export const typeQueries = `
; Interface declarations
(interface_declaration
  name: (type_identifier) @type.name
  type_parameters: (type_parameters)? @type.type_params
  (extends_type_clause)? @type.extends
  body: (object_type) @type.body) @type

; Type alias declarations
(type_alias_declaration
  name: (type_identifier) @type.name
  type_parameters: (type_parameters)? @type.type_params
  value: (_) @type.body) @type

; Enum declarations
(enum_declaration
  name: (identifier) @type.name
  body: (enum_body) @type.body) @type
`;
