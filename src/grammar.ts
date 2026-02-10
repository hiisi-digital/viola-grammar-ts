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

import type { GrammarDefinition } from "@hiisi/viola/grammars";
import { functionQueries } from "./queries/functions.ts";
import { stringQueries } from "./queries/strings.ts";
import { importQueries } from "./queries/imports.ts";
import { exportQueries } from "./queries/exports.ts";
import { typeQueries } from "./queries/types.ts";
import { docCommentQueries } from "./queries/docs.ts";

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
  // Transforms intentionally omitted — the extractor's default capture-based
  // extraction paths handle all basic cases correctly. Proper transforms for
  // richer data (typed params, async detection, etc.) will be added later.
};
