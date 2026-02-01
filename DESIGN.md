# viola-grammar-ts Design Document

## Overview

`@hiisi/viola-grammar-ts` is a grammar package for the Viola convention linter that enables parsing and extraction of structured data from TypeScript and JavaScript files using tree-sitter.

## Purpose

This package provides:

1. **Tree-sitter grammar configuration** for TypeScript/TSX/JavaScript/JSX
2. **Extraction queries** in S-expression format for capturing code elements
3. **Transform functions** for complex extraction logic that queries alone can't handle

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              @hiisi/viola-grammar-ts                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐    ┌──────────────────────┐   │
│  │  GrammarMeta    │    │   GrammarSource      │   │
│  │  - id: "ts"     │    │   - npm package ref  │   │
│  │  - extensions   │    │   - WASM file path   │   │
│  │  - globs        │    │                      │   │
│  └─────────────────┘    └──────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │            Extraction Queries                 │  │
│  │  - functions (declarations, expressions,     │  │
│  │              arrow functions, methods)       │  │
│  │  - strings (literals, template literals)     │  │
│  │  - imports (named, default, namespace)       │  │
│  │  - exports (named, default, re-exports)      │  │
│  │  - types (interfaces, type aliases, enums)   │  │
│  │  - docComments (JSDoc blocks)                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │            Transform Functions                │  │
│  │  - parseParams: destructuring, defaults,     │  │
│  │                 rest params, type annotations│  │
│  │  - extractReturnType: infer return types     │  │
│  │  - normalizeBody: strip comments, whitespace │  │
│  │  - isExported: detect export context         │  │
│  │  - parseImport: handle complex import syntax │  │
│  │  - parseExport: handle re-exports            │  │
│  │  - parseTypeFields: extract interface fields │  │
│  │  - parseDocComment: extract JSDoc tags       │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Query Design

### Capture Naming Convention

All queries follow the standard Viola capture naming:

- `@function.name`, `@function.params`, `@function.body`, `@function.return`
- `@string.value`, `@string.raw`, `@string.template`
- `@import.name`, `@import.from`, `@import.type_only`
- `@export.name`, `@export.kind`, `@export.from`
- `@type.name`, `@type.body`, `@type.kind`
- `@doc.content`

### Function Extraction

Must handle all TypeScript function forms:

```typescript
// Function declaration
function foo(a: string, b?: number): void { }

// Arrow function
const bar = (x: number) => x * 2;

// Method
class C { method() { } }

// Async/generator
async function* gen() { yield 1; }
```

Query patterns:
- `function_declaration`
- `arrow_function`
- `method_definition`
- `generator_function_declaration`

### Parameter Parsing

TypeScript parameters can be complex:

```typescript
function complex(
  simple: string,
  optional?: number,
  defaulted = 10,
  ...rest: string[],
  { destructured }: { destructured: boolean },
  [arrDestructured]: [number],
) { }
```

The `parseParams` transform must handle:
- Simple parameters
- Optional parameters (`?`)
- Default values (`= value`)
- Rest parameters (`...args`)
- Object destructuring
- Array destructuring
- Type annotations

### Import Extraction

TypeScript import forms:

```typescript
import foo from "module";           // default
import { bar } from "module";       // named
import { baz as qux } from "mod";   // renamed
import * as ns from "module";       // namespace
import type { T } from "module";    // type-only
import { type T } from "module";    // inline type
```

### Export Extraction

TypeScript export forms:

```typescript
export default foo;                  // default
export { bar };                      // named
export { baz as qux };              // renamed
export { x } from "module";          // re-export
export * from "module";              // re-export all
export type { T };                   // type-only
export function fn() {}              // declaration
export class C {}                    // declaration
```

### Type Extraction

TypeScript type declarations:

```typescript
interface Foo { a: string; b?: number; }
type Bar = { x: number } | null;
enum Color { Red, Green, Blue }
```

### JSDoc Parsing

Extract JSDoc with tags:

```typescript
/**
 * Description here.
 * @param x - The x parameter
 * @returns The result
 * @deprecated Use newFn instead
 */
function fn(x: number): number { }
```

The `parseDocComment` transform should extract:
- Description text
- @param tags with names and descriptions
- @returns description
- @deprecated message
- @example code blocks

## File Structure

```
viola-grammar-ts/
├── mod.ts                 # Main export (GrammarDefinition)
├── deno.json             # Package manifest
├── README.md             # Usage documentation
├── DESIGN.md             # This file
├── TODO.md               # Implementation tasks
├── LICENSE               # MPL-2.0
├── src/
│   ├── grammar.ts        # GrammarDefinition
│   ├── queries/
│   │   ├── functions.ts  # Function extraction queries
│   │   ├── strings.ts    # String literal queries
│   │   ├── imports.ts    # Import statement queries
│   │   ├── exports.ts    # Export statement queries
│   │   ├── types.ts      # Type/interface queries
│   │   └── docs.ts       # JSDoc comment queries
│   ├── transforms/
│   │   ├── params.ts     # Parameter parsing
│   │   ├── return-type.ts# Return type extraction
│   │   ├── normalize.ts  # Body normalization
│   │   ├── exports.ts    # Export detection
│   │   ├── imports.ts    # Import parsing
│   │   ├── types.ts      # Type field parsing
│   │   └── jsdoc.ts      # JSDoc parsing
│   └── mod.ts            # Internal exports
└── tests/
    ├── functions_test.ts
    ├── imports_test.ts
    ├── exports_test.ts
    ├── types_test.ts
    ├── params_test.ts
    └── jsdoc_test.ts
```

## Dependencies

- `@hiisi/viola/grammars` - Grammar type definitions
- `tree-sitter-typescript` - Tree-sitter grammar (npm, loaded as WASM)

## Usage

```typescript
import { viola, grammar, when } from "@hiisi/viola";
import typescript from "@hiisi/viola-grammar-ts";
import javascript from "@hiisi/viola-grammar-js";

export default viola()
  .add(typescript).as("ts")
  .add(javascript).as("js")
  .rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"))
  .rule(grammar("ts").supplements("js"), when.in("*.js", "*.jsx"));
```

## Relationship with JavaScript Grammar

TypeScript is a superset of JavaScript. The relationship is:

- For `.ts`/`.tsx` files: TypeScript grammar **overrides** JavaScript
- For `.js`/`.jsx` files: TypeScript grammar **supplements** JavaScript (extracts JSDoc types)

This allows JSDoc-typed JavaScript to benefit from type extraction while native TypeScript uses the full parser.

## Testing Strategy

1. **Unit tests** for each transform function
2. **Query tests** with known TypeScript snippets
3. **Integration tests** with full extraction pipeline
4. **Snapshot tests** for complex real-world files

## Performance Considerations

1. **Query efficiency**: Use specific node types, avoid overly broad patterns
2. **Transform caching**: Cache parsed parameter lists
3. **Lazy evaluation**: Only run transforms when captures exist
4. **WASM loading**: Load grammar once, reuse parser instances
