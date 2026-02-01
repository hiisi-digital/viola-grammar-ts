/**
 * Tests for TypeScript grammar definition.
 *
 * Note: These tests document expected behavior.
 * Full integration testing requires the Viola framework.
 *
 * @module
 */

import { typescript } from "../mod.ts";

// Simple assert helpers
function assertEquals(actual: unknown, expected: unknown, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected} but got ${actual}`,
    );
  }
}

function assertExists(value: unknown, message?: string) {
  if (value === undefined || value === null) {
    throw new Error(message || "Expected value to exist");
  }
}

function assertIncludes(haystack: string, needle: string, message?: string) {
  if (!haystack.includes(needle)) {
    throw new Error(
      message || `Expected "${haystack}" to include "${needle}"`,
    );
  }
}

Deno.test("TypeScript grammar - metadata", () => {
  assertEquals(typescript.meta.id, "typescript");
  assertEquals(typescript.meta.name, "TypeScript");
  assertEquals(
    typescript.meta.extensions.join(","),
    ".ts,.tsx,.mts,.cts",
  );
});

Deno.test("TypeScript grammar - grammar source", () => {
  assertEquals(typescript.grammar.source, "npm");
  assertEquals(typescript.grammar.package, "tree-sitter-typescript");
  assertEquals(typescript.grammar.wasm, "tree-sitter-typescript.wasm");
});

Deno.test("TypeScript grammar - queries exist", () => {
  assertExists(typescript.queries.functions);
  assertExists(typescript.queries.strings);
  assertExists(typescript.queries.imports);
  assertExists(typescript.queries.exports);
  assertExists(typescript.queries.types);
  assertExists(typescript.queries.docComments);
});

Deno.test("TypeScript grammar - function queries contain patterns", () => {
  const fnQuery = typescript.queries.functions!;

  // Should capture function declarations
  assertIncludes(fnQuery, "function_declaration");
  assertIncludes(fnQuery, "@function.name");
  assertIncludes(fnQuery, "@function.params");
  assertIncludes(fnQuery, "@function.body");

  // Should capture arrow functions
  assertIncludes(fnQuery, "arrow_function");

  // Should capture methods
  assertIncludes(fnQuery, "method_definition");
});

Deno.test("TypeScript grammar - import queries contain patterns", () => {
  const importQuery = typescript.queries.imports!;

  assertIncludes(importQuery, "import_statement");
  assertIncludes(importQuery, "@import.name");
  assertIncludes(importQuery, "@import.from");
});

Deno.test("TypeScript grammar - export queries contain patterns", () => {
  const exportQuery = typescript.queries.exports!;

  assertIncludes(exportQuery, "export_statement");
  assertIncludes(exportQuery, "@export.name");
});

Deno.test("TypeScript grammar - type queries contain patterns", () => {
  const typeQuery = typescript.queries.types!;

  assertIncludes(typeQuery, "interface_declaration");
  assertIncludes(typeQuery, "type_alias_declaration");
  assertIncludes(typeQuery, "enum_declaration");
  assertIncludes(typeQuery, "@type.name");
  assertIncludes(typeQuery, "@type.body");
});

Deno.test("TypeScript grammar - transforms exist", () => {
  assertExists(typescript.transforms);
  assertExists(typescript.transforms!.parseParams);
  assertExists(typescript.transforms!.extractReturnType);
  assertExists(typescript.transforms!.normalizeBody);
  assertExists(typescript.transforms!.isExported);
  assertExists(typescript.transforms!.parseImport);
  assertExists(typescript.transforms!.parseTypeFields);
  assertExists(typescript.transforms!.parseDocComment);
});
