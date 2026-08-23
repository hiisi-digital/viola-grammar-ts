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

; Method definitions inside a named class.
;
; Matched through the class so the class name comes with the method. A method
; called get or build or has is named for what it does to its own type, and
; without the owner every class with a get looks like a duplicate of every
; other one.
(class_declaration
  name: (type_identifier) @function.parent
  body: (class_body
    (method_definition
      name: [
        (property_identifier) @function.name
        (computed_property_name (string) @function.name)
      ]
      parameters: (formal_parameters) @function.params
      return_type: (type_annotation)? @function.return
      body: (statement_block) @function.body) @function)) @function.method

; Method definitions anywhere else: an object literal, an anonymous class.
(method_definition
  name: [
    (property_identifier) @function.name
    (computed_property_name (string) @function.name)
  ]
  parameters: (formal_parameters) @function.params
  return_type: (type_annotation)? @function.return
  body: (statement_block) @function.body) @function @function.method

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
