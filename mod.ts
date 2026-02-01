/**
 * @hiisi/viola-grammar-ts
 *
 * TypeScript and JavaScript grammar package for the Viola convention linter.
 * Provides tree-sitter based parsing and extraction for TS/TSX/JS/JSX files.
 *
 * @example
 * ```ts
 * import { viola, grammar, when } from "@hiisi/viola";
 * import typescript from "@hiisi/viola-grammar-ts";
 *
 * export default viola()
 *   .add(typescript).as("ts")
 *   .rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"));
 * ```
 *
 * @module
 */

import type { GrammarDefinition } from "@hiisi/viola/grammars";

/**
 * TypeScript grammar definition for Viola.
 *
 * Supports:
 * - TypeScript (.ts, .mts, .cts)
 * - TypeScript JSX (.tsx)
 *
 * Extracts:
 * - Functions (declarations, arrows, methods, generators, async)
 * - Types (interfaces, type aliases, enums)
 * - Imports (default, named, namespace, type-only)
 * - Exports (default, named, re-exports, type-only)
 * - Strings (literals, templates)
 * - JSDoc comments
 */
export const typescript: GrammarDefinition = {
  meta: {
    id: "typescript",
    name: "TypeScript",
    description: "TypeScript and TSX grammar for Viola",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
  },
  grammar: {
    source: "npm",
    package: "tree-sitter-typescript",
    wasm: "tree-sitter-typescript.wasm",
  },
  queries: {
    // TODO: Implement function extraction queries
    functions: `
      ; Function declarations
      (function_declaration
        name: (identifier) @function.name
        parameters: (formal_parameters) @function.params
        return_type: (type_annotation)? @function.return
        body: (statement_block) @function.body) @function

      ; Arrow functions assigned to variables
      (lexical_declaration
        (variable_declarator
          name: (identifier) @function.name
          value: (arrow_function
            parameters: (formal_parameters) @function.params
            return_type: (type_annotation)? @function.return
            body: (_) @function.body))) @function

      ; Method definitions
      (method_definition
        name: (property_identifier) @function.name
        parameters: (formal_parameters) @function.params
        return_type: (type_annotation)? @function.return
        body: (statement_block) @function.body) @function
    `,

    // TODO: Implement string extraction queries
    strings: `
      (string) @string.value
      (template_string) @string.value @string.template
    `,

    // TODO: Implement import extraction queries
    imports: `
      (import_statement
        (import_clause
          (identifier) @import.name)?
        source: (string) @import.from) @import
    `,

    // TODO: Implement export extraction queries
    exports: `
      (export_statement
        declaration: (_
          name: (identifier) @export.name)?) @export
    `,

    // TODO: Implement type extraction queries
    types: `
      (interface_declaration
        name: (type_identifier) @type.name
        body: (object_type) @type.body) @type

      (type_alias_declaration
        name: (type_identifier) @type.name
        value: (_) @type.body) @type
    `,

    // TODO: Implement doc comment queries
    docComments: `
      (comment) @doc.content
    `,
  },
  transforms: {
    // TODO: Implement transform functions
    // parseParams: parseTypeScriptParams,
    // extractReturnType: extractTSReturnType,
    // normalizeBody: normalizeTSBody,
    // isExported: isTSExported,
    // parseImport: parseTSImport,
    // parseExport: parseTSExport,
    // parseTypeFields: parseTSTypeFields,
    // parseDocComment: parseTSDocComment,
  },
};

/**
 * Default export for convenient importing.
 *
 * @example
 * ```ts
 * import typescript from "@hiisi/viola-grammar-ts";
 * ```
 */
export default typescript;
