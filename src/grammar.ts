/**
 * TypeScript grammar definition for Viola.
 *
 * This module assembles the complete GrammarDefinition including:
 * - Metadata (id, name, extensions)
 * - Grammar source configuration
 * - Extraction queries for all code elements
 * - Transform functions for complex extractions
 *
 * @module
 */

import type { GrammarDefinition } from "./types.ts";
import { functionQueries } from "./queries/functions.ts";
import { stringQueries } from "./queries/strings.ts";
import { importQueries } from "./queries/imports.ts";
import { exportQueries } from "./queries/exports.ts";
import { typeQueries } from "./queries/types.ts";
import { docCommentQueries } from "./queries/docs.ts";
import { parseParams } from "./transforms/params.ts";
import { extractReturnType } from "./transforms/return-type.ts";
import { normalizeBody } from "./transforms/normalize.ts";
import { isExported } from "./transforms/exports.ts";
import { parseImport } from "./transforms/imports.ts";
import { parseTypeFields } from "./transforms/types.ts";
import { parseDocComment } from "./transforms/jsdoc.ts";

/**
 * TypeScript grammar definition for the Viola convention linter.
 *
 * Supports TypeScript (.ts, .tsx, .mts, .cts) files and extracts:
 * - Functions (declarations, arrows, methods, generators, async)
 * - Types (interfaces, type aliases, enums)
 * - Imports (default, named, namespace, type-only)
 * - Exports (default, named, re-exports, type-only)
 * - Strings (literals, templates)
 * - JSDoc comments
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
 */
export const typescript: GrammarDefinition = {
  meta: {
    id: "typescript",
    name: "TypeScript",
    description: "TypeScript and TSX grammar for Viola convention linting",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
  },
  grammar: {
    source: "npm",
    package: "tree-sitter-typescript",
    wasm: "tree-sitter-typescript.wasm",
  },
  queries: {
    functions: functionQueries,
    strings: stringQueries,
    imports: importQueries,
    exports: exportQueries,
    types: typeQueries,
    docComments: docCommentQueries,
  },
  transforms: {
    parseParams,
    extractReturnType,
    normalizeBody,
    isExported,
    parseImport,
    parseTypeFields,
    parseDocComment,
  },
};
