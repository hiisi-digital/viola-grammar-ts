/**
 * Type definitions for Viola grammar packages.
 *
 * This is a temporary file that defines the types expected from @hiisi/viola/grammars.
 * Once the viola package is published, this file can be removed.
 *
 * @module
 */

/**
 * Grammar metadata.
 */
export interface GrammarMeta {
  /** Unique identifier for the grammar (e.g., "typescript", "python") */
  id: string;
  /** Display name */
  name: string;
  /** Description of what the grammar parses */
  description: string;
  /** File extensions this grammar handles (e.g., [".ts", ".tsx"]) */
  extensions: string[];
  /** Optional glob patterns */
  globs?: string[];
}

/**
 * Grammar source configuration.
 */
export interface GrammarSource {
  /** Source type: "npm" for npm packages */
  source: "npm";
  /** Package name */
  package: string;
  /** WASM file path within the package */
  wasm: string;
}

/**
 * Extract queries for different code elements.
 */
export interface GrammarQueries {
  /** Query for extracting functions */
  functions?: string;
  /** Query for extracting string literals */
  strings?: string;
  /** Query for extracting imports */
  imports?: string;
  /** Query for extracting exports */
  exports?: string;
  /** Query for extracting type declarations */
  types?: string;
  /** Query for extracting documentation comments */
  docComments?: string;
  /** Custom queries */
  [key: string]: string | undefined;
}

/**
 * Transform functions for complex extractions.
 */
export interface GrammarTransforms {
  /** Parse function parameters */
  parseParams?: (params: unknown) => unknown;
  /** Extract return type */
  extractReturnType?: (returnType: unknown) => unknown;
  /** Normalize function body */
  normalizeBody?: (body: unknown) => unknown;
  /** Detect if node is exported */
  isExported?: (node: unknown) => unknown;
  /** Parse import statement */
  parseImport?: (importNode: unknown) => unknown;
  /** Parse export statement */
  parseExport?: (exportNode: unknown) => unknown;
  /** Parse type fields */
  parseTypeFields?: (typeBody: unknown) => unknown;
  /** Parse JSDoc comment */
  parseDocComment?: (comment: unknown) => unknown;
  /** Custom transforms */
  [key: string]: ((arg: unknown) => unknown) | undefined;
}

/**
 * Complete grammar definition.
 */
export interface GrammarDefinition {
  /** Grammar metadata */
  meta: GrammarMeta;
  /** Grammar source configuration */
  grammar: GrammarSource;
  /** Extraction queries */
  queries: GrammarQueries;
  /** Transform functions */
  transforms?: GrammarTransforms;
}
