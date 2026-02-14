/**
 * Tests for TypeScript grammar definition.
 *
 * These tests parse REAL TypeScript code through tree-sitter and verify
 * that queries and transforms produce correct extraction results.
 *
 * @module
 */

import { assertEquals, assertExists } from "@std/assert";
import { typescript } from "../mod.ts";
import {
  createParser,
  extractFileData,
  initTreeSitter,
  loadGrammar,
  queryAll,
  type Language,
  type Parser,
} from "@hiisi/viola/grammars";

// =============================================================================
// Setup — shared parser instance across tests
// =============================================================================

let parser: Parser;
let language: Language;
let ready = false;

async function setup(): Promise<void> {
  if (ready) return;
  await initTreeSitter();
  language = await loadGrammar(typescript.grammar);
  parser = createParser(typescript.grammar, language);
  ready = true;
}

/**
 * Parse TypeScript source and extract all data using the grammar definition.
 */
async function extract(source: string, filePath = "test.ts") {
  await setup();
  const tree = parser.parse(source);
  return extractFileData(tree, language, typescript, filePath, source);
}

/**
 * Run a specific query against TypeScript source.
 */
async function query(querySource: string, source: string) {
  await setup();
  const tree = parser.parse(source);
  return queryAll(tree, language, querySource, source);
}

// =============================================================================
// Export Extraction — the critical area where async/abstract bugs lived
// =============================================================================

Deno.test("exports - export function extracts function name", async () => {
  const data = await extract(`export function greet() { return "hello"; }`);
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("greet"), true, "Should export 'greet'");
});

Deno.test("exports - export async function extracts function name, not 'async'", async () => {
  const data = await extract(
    `export async function fetchData(url: string): Promise<string> {
  return await fetch(url).then(r => r.text());
}`,
  );
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("fetchData"), true, "Should export 'fetchData'");
  assertEquals(
    names.includes("async"),
    false,
    "Should NOT export 'async' as a name",
  );
});

Deno.test("exports - export abstract class extracts class name, not 'abstract'", async () => {
  const data = await extract(
    `export abstract class BaseHandler {
  abstract handle(): void;
}`,
  );
  const names = data.exports.map((e) => e.name);
  assertEquals(
    names.includes("BaseHandler"),
    true,
    "Should export 'BaseHandler'",
  );
  assertEquals(
    names.includes("abstract"),
    false,
    "Should NOT export 'abstract' as a name",
  );
});

Deno.test("exports - export class extracts class name", async () => {
  const data = await extract(`export class Router { route() {} }`);
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("Router"), true, "Should export 'Router'");
});

Deno.test("exports - export const extracts variable name", async () => {
  const data = await extract(`export const MAX_RETRIES = 3;`);
  const names = data.exports.map((e) => e.name);
  assertEquals(
    names.includes("MAX_RETRIES"),
    true,
    "Should export 'MAX_RETRIES'",
  );
});

Deno.test("exports - export interface extracts interface name", async () => {
  const data = await extract(
    `export interface Config { host: string; port: number; }`,
  );
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("Config"), true, "Should export 'Config'");
});

Deno.test("exports - export type alias extracts type name", async () => {
  const data = await extract(`export type Result<T> = T | Error;`);
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("Result"), true, "Should export 'Result'");
});

Deno.test("exports - export enum extracts enum name", async () => {
  const data = await extract(
    `export enum Direction { Up, Down, Left, Right }`,
  );
  const names = data.exports.map((e) => e.name);
  assertEquals(
    names.includes("Direction"),
    true,
    "Should export 'Direction'",
  );
});

Deno.test("exports - named export extracts identifier", async () => {
  const data = await extract(`
const foo = 1;
const bar = 2;
export { foo, bar };
`);
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("foo"), true, "Should export 'foo'");
  assertEquals(names.includes("bar"), true, "Should export 'bar'");
});

Deno.test("exports - export default identifier", async () => {
  const data = await extract(`
const handler = () => {};
export default handler;
`);
  const names = data.exports.map((e) => e.name);
  assertEquals(names.includes("handler"), true, "Should export 'handler'");
});

Deno.test("exports - re-export with source", async () => {
  const data = await extract(`export { parse } from "./parser.ts";`);
  const reExport = data.exports.find((e) => e.from);
  assertExists(reExport, "Should find a re-export");
  assertEquals(reExport.from, "./parser.ts");
});

Deno.test("exports - export * from module query matches", async () => {
  // Note: viola core extractor (0.1.5) skips exports without a name capture,
  // so export * is not included in extractFileData results.
  // Verify the query itself matches correctly.
  const matches = await query(
    typescript.queries.exports!,
    `export * from "./utils.ts";`,
  );
  assertEquals(matches.length > 0, true, "Export query should match export *");
  const fromCapture = matches.find((m) => m.get("export.from"));
  assertExists(fromCapture, "Should capture the source module");
});

Deno.test("exports - multiple mixed exports in one file", async () => {
  const data = await extract(`
export async function fetchData(): Promise<void> {}
export abstract class Base {}
export const VERSION = "1.0";
export interface Options { verbose: boolean; }
export type ID = string | number;
export enum LogLevel { Debug, Info, Warn, Error }
export function syncFn() { return 1; }
`);
  const names = data.exports.map((e) => e.name);

  // All real names present
  for (const expected of [
    "fetchData",
    "Base",
    "VERSION",
    "Options",
    "ID",
    "LogLevel",
    "syncFn",
  ]) {
    assertEquals(names.includes(expected), true, `Should export '${expected}'`);
  }

  // No keyword leakage
  for (const bad of ["async", "abstract", "const", "function", "interface"]) {
    assertEquals(
      names.includes(bad),
      false,
      `Should NOT export keyword '${bad}'`,
    );
  }
});

Deno.test("exports - generator function declaration", async () => {
  const data = await extract(
    `export function* generateIds() { yield 1; yield 2; }`,
  );
  const names = data.exports.map((e) => e.name);
  assertEquals(
    names.includes("generateIds"),
    true,
    "Should export 'generateIds'",
  );
});

// =============================================================================
// Function Extraction
// =============================================================================

Deno.test("functions - regular function declaration", async () => {
  const data = await extract(`function greet(name: string): string {
  return "hello " + name;
}`);
  assertEquals(data.functions.length, 1);
  assertEquals(data.functions[0]!.name, "greet");
});

Deno.test("functions - arrow function assigned to const", async () => {
  const data = await extract(
    `const add = (a: number, b: number): number => a + b;`,
  );
  assertEquals(data.functions.length, 1);
  assertEquals(data.functions[0]!.name, "add");
});

Deno.test("functions - arrow function with block body", async () => {
  const data = await extract(`const process = (x: number) => {
  return x * 2;
};`);
  assertEquals(data.functions.length, 1);
  assertEquals(data.functions[0]!.name, "process");
});

Deno.test("functions - generator function", async () => {
  const data = await extract(`function* range(n: number) {
  for (let i = 0; i < n; i++) yield i;
}`);
  assertEquals(data.functions.length, 1);
  assertEquals(data.functions[0]!.name, "range");
});

Deno.test("functions - class method", async () => {
  const data = await extract(`class Greeter {
  greet(name: string): string {
    return "hello " + name;
  }
  static create(): Greeter {
    return new Greeter();
  }
}`);
  const names = data.functions.map((f) => f.name);
  assertEquals(names.includes("greet"), true, "Should find method 'greet'");
  assertEquals(names.includes("create"), true, "Should find method 'create'");
});

Deno.test("functions - function expression assigned to variable", async () => {
  const data = await extract(
    `const handler = function processEvent(e: Event) { console.log(e); };`,
  );
  assertEquals(data.functions.length, 1);
  assertEquals(data.functions[0]!.name, "handler");
});

Deno.test("functions - multiple functions in one file", async () => {
  const data = await extract(`
function alpha() { return 1; }
const beta = () => 2;
function* gamma() { yield 3; }
`);
  const names = data.functions.map((f) => f.name);
  assertEquals(names.includes("alpha"), true);
  assertEquals(names.includes("beta"), true);
  assertEquals(names.includes("gamma"), true);
});

// =============================================================================
// Function Parameter Extraction (via parseParams transform)
// =============================================================================

Deno.test("params - simple typed parameters", async () => {
  const data = await extract(
    `function add(a: number, b: number): number { return a + b; }`,
  );
  const params = data.functions[0]!.params;
  assertEquals(params.length, 2);
  assertEquals(params[0]!.name, "a");
  assertEquals(params[1]!.name, "b");
});

Deno.test("params - optional parameter", async () => {
  const data = await extract(
    `function greet(name: string, greeting?: string) { return greeting ?? "hi"; }`,
  );
  const params = data.functions[0]!.params;
  assertEquals(params.length, 2);
  assertEquals(params[1]!.name, "greeting");
  assertEquals(params[1]!.optional, true);
});

Deno.test("params - rest parameter", async () => {
  const data = await extract(
    `function sum(...nums: number[]): number { return nums.reduce((a, b) => a + b, 0); }`,
  );
  // The outer function should have rest param
  const sumFn = data.functions.find((f) => f.name === "sum");
  assertExists(sumFn);
  const restParam = sumFn.params.find((p) => p.rest);
  assertExists(restParam, "Should find rest parameter");
  assertEquals(restParam.name, "nums");
});

Deno.test("params - default value parameter", async () => {
  const data = await extract(
    `function repeat(s: string, count: number = 1) { return s.repeat(count); }`,
  );
  const params = data.functions[0]!.params;
  assertEquals(params.length, 2);
  assertEquals(params[1]!.name, "count");
  assertEquals(params[1]!.optional, true);
});

Deno.test("params - destructured object parameter", async () => {
  const data = await extract(
    `function configure({ host, port }: { host: string; port: number }) {}`,
  );
  const params = data.functions[0]!.params;
  assertEquals(params.length, 1);
  // Destructured params get a composite name
  assertEquals(params[0]!.name.includes("host"), true);
  assertEquals(params[0]!.name.includes("port"), true);
});

Deno.test("params - zero parameters", async () => {
  const data = await extract(`function noop() {}`);
  assertEquals(data.functions[0]!.params.length, 0);
});

// =============================================================================
// Return Type Extraction (via extractReturnType transform)
// =============================================================================

Deno.test("return type - explicit annotation", async () => {
  const data = await extract(`function getAge(): number { return 42; }`);
  assertExists(data.functions[0]!.returnType);
  assertEquals(data.functions[0]!.returnType!.includes("number"), true);
});

Deno.test("return type - Promise return type", async () => {
  const data = await extract(
    `async function fetchName(): Promise<string> { return "name"; }`,
  );
  assertExists(data.functions[0]!.returnType);
  assertEquals(
    data.functions[0]!.returnType!.includes("Promise"),
    true,
  );
});

Deno.test("return type - void", async () => {
  const data = await extract(`function log(msg: string): void { console.log(msg); }`);
  assertExists(data.functions[0]!.returnType);
  assertEquals(data.functions[0]!.returnType!.includes("void"), true);
});

Deno.test("return type - no annotation returns undefined", async () => {
  const data = await extract(`function mystery() { return 42; }`);
  // Without explicit return type, it should be undefined
  assertEquals(data.functions[0]!.returnType, undefined);
});

// =============================================================================
// Import Extraction (via parseImport transform)
// =============================================================================

Deno.test("imports - default import", async () => {
  const data = await extract(`import React from "react";`);
  assertEquals(data.imports.length >= 1, true);
  const reactImport = data.imports.find((i) => i.name === "React");
  assertExists(reactImport, "Should find default import 'React'");
  assertEquals(reactImport.from, "react");
});

Deno.test("imports - named imports", async () => {
  const data = await extract(
    `import { useState, useEffect } from "react";`,
  );
  const names = data.imports.map((i) => i.name);
  assertEquals(
    names.includes("useState"),
    true,
    "Should import 'useState'",
  );
  assertEquals(
    names.includes("useEffect"),
    true,
    "Should import 'useEffect'",
  );
});

Deno.test("imports - type-only import", async () => {
  const data = await extract(
    `import type { Config } from "./config.ts";`,
  );
  assertEquals(data.imports.length >= 1, true);
  const configImport = data.imports.find((i) => i.name === "Config");
  assertExists(configImport, "Should find type import 'Config'");
  assertEquals(configImport.isTypeOnly, true);
});

Deno.test("imports - namespace import", async () => {
  const data = await extract(`import * as path from "node:path";`);
  assertEquals(data.imports.length >= 1, true);
  const pathImport = data.imports.find((i) => i.name === "path");
  assertExists(pathImport, "Should find namespace import 'path'");
  assertEquals(pathImport.isNamespace, true);
});

Deno.test("imports - side-effect import", async () => {
  const data = await extract(`import "./polyfill.ts";`);
  // Side-effect imports should still be captured (with default name)
  assertEquals(data.imports.length >= 1, true);
  const sideEffect = data.imports.find((i) => i.from === "./polyfill.ts");
  assertExists(sideEffect, "Should find side-effect import");
});

Deno.test("imports - renamed import", async () => {
  const data = await extract(
    `import { readFile as read } from "node:fs/promises";`,
  );
  assertEquals(data.imports.length >= 1, true);
  // The imported name used locally should be 'read' (the alias)
  const readImport = data.imports.find((i) => i.name === "read");
  assertExists(readImport, "Should find renamed import as 'read'");
});

Deno.test("imports - multiple import statements", async () => {
  const data = await extract(`
import { join } from "@std/path";
import { exists } from "@std/fs";
import type { Devspace } from "../types/mod.ts";
`);
  assertEquals(data.imports.length >= 3, true);
  const froms = data.imports.map((i) => i.from);
  assertEquals(froms.includes("@std/path"), true);
  assertEquals(froms.includes("@std/fs"), true);
  assertEquals(froms.includes("../types/mod.ts"), true);
});

// =============================================================================
// Type Extraction
// =============================================================================

Deno.test("types - interface declaration", async () => {
  const data = await extract(`
interface User {
  name: string;
  age: number;
}
`);
  assertEquals(data.types.length, 1);
  assertEquals(data.types[0]!.name, "User");
});

Deno.test("types - type alias", async () => {
  const data = await extract(`type Result<T> = { ok: true; value: T } | { ok: false; error: Error };`);
  assertEquals(data.types.length, 1);
  assertEquals(data.types[0]!.name, "Result");
});

Deno.test("types - enum declaration", async () => {
  const data = await extract(
    `enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }`,
  );
  assertEquals(data.types.length, 1);
  assertEquals(data.types[0]!.name, "Direction");
});

Deno.test("types - interface with extends", async () => {
  const data = await extract(`
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
`);
  const names = data.types.map((t) => t.name);
  assertEquals(names.includes("Animal"), true);
  assertEquals(names.includes("Dog"), true);
});

Deno.test("types - generic interface", async () => {
  const data = await extract(`
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
}
`);
  assertEquals(data.types.length, 1);
  assertEquals(data.types[0]!.name, "Repository");
});

// =============================================================================
// Query Syntax Validation — queries compile without error
// =============================================================================

Deno.test("queries - function query compiles and produces matches", async () => {
  const matches = await query(
    typescript.queries.functions,
    `function hello() { return 1; }`,
  );
  assertEquals(matches.length > 0, true, "Function query should produce matches");
  const name = matches[0]!.get("function.name");
  assertExists(name);
  assertEquals(name.text, "hello");
});

Deno.test("queries - export query compiles and produces matches", async () => {
  const matches = await query(
    typescript.queries.exports!,
    `export const FOO = 1;`,
  );
  assertEquals(matches.length > 0, true, "Export query should produce matches");
});

Deno.test("queries - import query compiles and produces matches", async () => {
  const matches = await query(
    typescript.queries.imports!,
    `import { foo } from "bar";`,
  );
  assertEquals(matches.length > 0, true, "Import query should produce matches");
});

Deno.test("queries - type query compiles and produces matches", async () => {
  const matches = await query(
    typescript.queries.types!,
    `interface Foo { bar: string; }`,
  );
  assertEquals(matches.length > 0, true, "Type query should produce matches");
});

Deno.test("queries - string query compiles", async () => {
  assertExists(typescript.queries.strings, "Should have string query");
  // Just verify it compiles — run against a file with strings
  const matches = await query(
    typescript.queries.strings!,
    `const msg = "hello world";`,
  );
  // String query should at least compile without error
  assertEquals(matches.length >= 0, true);
});

Deno.test("queries - docComment query compiles", async () => {
  assertExists(typescript.queries.docComments, "Should have docComment query");
  const matches = await query(
    typescript.queries.docComments!,
    `/** This is a doc comment */\nfunction foo() {}`,
  );
  assertEquals(matches.length >= 0, true);
});

// =============================================================================
// isExported Transform — verifies export detection via tree walking
// =============================================================================

Deno.test("isExported - exported function detected", async () => {
  const data = await extract(`
export function visible() { return 1; }
function hidden() { return 2; }
`);
  const visible = data.functions.find((f) => f.name === "visible");
  const hidden = data.functions.find((f) => f.name === "hidden");
  assertExists(visible);
  assertExists(hidden);
  assertEquals(visible.isExported, true, "'visible' should be marked exported");
  assertEquals(hidden.isExported, false, "'hidden' should NOT be marked exported");
});

Deno.test("isExported - exported const arrow function detected", async () => {
  const data = await extract(`
export const handler = () => { return "ok"; };
const internal = () => { return "nope"; };
`);
  const handler = data.functions.find((f) => f.name === "handler");
  const internal = data.functions.find((f) => f.name === "internal");
  assertExists(handler);
  assertExists(internal);
  assertEquals(handler.isExported, true);
  assertEquals(internal.isExported, false);
});

// =============================================================================
// Full Integration — realistic file extraction
// =============================================================================

Deno.test("integration - realistic TypeScript module extraction", async () => {
  const source = `
import { join } from "@std/path";
import type { Config } from "./types.ts";

export interface AppConfig extends Config {
  port: number;
  host: string;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

export async function startServer(config: AppConfig): Promise<void> {
  const addr = join(config.host, String(config.port));
  console.log("Starting server at", addr);
}

export function createConfig(overrides?: Partial<AppConfig>): AppConfig {
  return {
    port: 8080,
    host: "localhost",
    ...overrides,
  } as AppConfig;
}

function internal(): void {
  // not exported
}

export const VERSION = "1.0.0";

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}
`;

  const data = await extract(source, "src/server.ts");

  // Exports — verify all expected exports, no keyword leakage
  const exportNames = data.exports.map((e) => e.name);
  for (const expected of [
    "AppConfig",
    "Result",
    "startServer",
    "createConfig",
    "VERSION",
    "LogLevel",
  ]) {
    assertEquals(
      exportNames.includes(expected),
      true,
      `Should export '${expected}'`,
    );
  }
  assertEquals(
    exportNames.includes("async"),
    false,
    "No keyword leakage",
  );
  assertEquals(
    exportNames.includes("internal"),
    false,
    "Private function should not appear in exports",
  );

  // Functions
  const fnNames = data.functions.map((f) => f.name);
  assertEquals(fnNames.includes("startServer"), true);
  assertEquals(fnNames.includes("createConfig"), true);
  assertEquals(fnNames.includes("internal"), true);

  // Imports
  assertEquals(data.imports.length >= 2, true);
  const pathImport = data.imports.find((i) => i.from === "@std/path");
  assertExists(pathImport);

  // Types
  const typeNames = data.types.map((t) => t.name);
  assertEquals(typeNames.includes("AppConfig"), true);
  assertEquals(typeNames.includes("Result"), true);
  assertEquals(typeNames.includes("LogLevel"), true);
});
