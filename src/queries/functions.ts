/**
 * Tree-sitter queries for extracting function definitions from TypeScript/JavaScript.
 *
 * Captures all function forms:
 * - Function declarations
 * - Arrow functions
 * - Method definitions
 * - Generator functions
 * - Async functions
 *
 * Uses standard Viola capture naming:
 * - @function.name - Function identifier
 * - @function.params - Parameter list
 * - @function.body - Function body
 * - @function.return - Return type annotation
 * - @function - Entire function node (for location)
 *
 * @module
 */

/**
 * Tree-sitter query for extracting functions from TypeScript/JavaScript.
 *
 * Handles:
 * - Regular function declarations
 * - Generator function declarations
 * - Async function declarations
 * - Arrow functions assigned to variables
 * - Method definitions in classes
 * - Object method shorthand
 */
export const functionQueries = `
; Function declarations
(function_declaration
  name: (identifier) @function.name
  parameters: (formal_parameters) @function.params
  return_type: (type_annotation)? @function.return
  body: (statement_block) @function.body) @function

; Generator function declarations
(generator_function_declaration
  name: (identifier) @function.name
  parameters: (formal_parameters) @function.params
  return_type: (type_annotation)? @function.return
  body: (statement_block) @function.body) @function

; Arrow functions assigned to const/let/var
(lexical_declaration
  (variable_declarator
    name: (identifier) @function.name
    value: (arrow_function
      parameters: [
        (formal_parameters) @function.params
        (identifier) @function.params
      ]
      return_type: (type_annotation)? @function.return
      body: [
        (statement_block) @function.body
        (_) @function.body
      ]))) @function

(variable_declaration
  (variable_declarator
    name: (identifier) @function.name
    value: (arrow_function
      parameters: [
        (formal_parameters) @function.params
        (identifier) @function.params
      ]
      return_type: (type_annotation)? @function.return
      body: [
        (statement_block) @function.body
        (_) @function.body
      ]))) @function

; Method definitions in classes
(method_definition
  name: [
    (property_identifier) @function.name
    (computed_property_name (string) @function.name)
  ]
  parameters: (formal_parameters) @function.params
  return_type: (type_annotation)? @function.return
  body: (statement_block) @function.body) @function

; Object method shorthand
(pair
  key: (property_identifier) @function.name
  value: (function_expression
    parameters: (formal_parameters) @function.params
    return_type: (type_annotation)? @function.return
    body: (statement_block) @function.body)) @function

; Function expressions assigned to variables
(lexical_declaration
  (variable_declarator
    name: (identifier) @function.name
    value: (function_expression
      parameters: (formal_parameters) @function.params
      return_type: (type_annotation)? @function.return
      body: (statement_block) @function.body))) @function

(variable_declaration
  (variable_declarator
    name: (identifier) @function.name
    value: (function_expression
      parameters: (formal_parameters) @function.params
      return_type: (type_annotation)? @function.return
      body: (statement_block) @function.body))) @function
`;
