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

export { typescript } from "./src/grammar.ts";
export { typescript as default } from "./src/grammar.ts";
export type {
  GrammarDefinition,
  GrammarMeta,
  GrammarQueries,
  GrammarSource,
  GrammarTransforms,
} from "./src/types.ts";
