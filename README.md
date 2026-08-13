# @hiisi/viola-grammar-ts

TypeScript grammar package for the [Viola](https://github.com/hiisi-digital/viola) convention linter.

## Overview

This package provides tree-sitter based parsing and extraction for TypeScript files (`.ts`, `.tsx`, `.mts`, `.cts`). It extracts structured data (functions, types, imports, exports, strings) that Viola linters can analyze. When a separate JavaScript grammar is registered, Viola's grammar relationships control how the two interact on shared files.

## Installation

```bash
deno add jsr:@hiisi/viola-grammar-ts
```

## Usage

```typescript
import { viola, when, report } from "@hiisi/viola";
import typescript from "@hiisi/viola-grammar-ts";

export default viola()
  // register the grammar
  .add(typescript).as("ts")

  // your linter rules
  .rule(report.error, when.in("src/**"));
```

## Supported File Extensions

- `.ts` - TypeScript
- `.tsx` - TypeScript JSX
- `.mts` - TypeScript ES modules
- `.cts` - TypeScript CommonJS modules

## Extracted Data

### Functions

All function forms are extracted:

```typescript
// function declarations
function foo(a: string, b?: number): void { }

// arrow functions
const bar = (x: number) => x * 2;

// methods
class MyClass {
  method(arg: string): boolean { }
}

// generator declarations
function* generator() { yield 1; }
```

Captured data:
- Name
- Parameters (with types, optionality, defaults, rest, destructuring)
- Return type
- Body (raw and normalized)
- Exported flag

### Types

```typescript
interface User {
  name: string;
  age?: number;
}

type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

enum Status { Active, Inactive }
```

Captured data:
- Name
- Fields with types (properties, method signatures, index signatures, enum members)
- Body (raw and normalized)
- Exported flag

### Imports

```typescript
import foo from "module";           // default
import { bar } from "module";       // named
import { baz as qux } from "mod";   // renamed
import * as ns from "module";       // namespace
import type { T } from "module";    // type-only
```

Captured data (one entry per imported name):
- Name (the local alias when renamed)
- Source module
- Type-only flag
- Namespace flag

### Exports

```typescript
export default foo;
export { bar };
export { baz as qux };
export { x } from "module";
export * from "module";
export type { T };
export function fn() {}
```

Captured data:
- Exported name
- Source module (for re-exports)
- Type-only flag (for `export type { }` statements)

### Strings

```typescript
const single = 'hello';
const double = "world";
const template = `Hello, ${name}!`;
```

Captured data:
- Value (quotes stripped)
- Template flag

### JSDoc

```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns The sum
 */
function sum(a: number, b: number): number { }
```

Comment nodes are matched by the doc-comment query, and the `parseDocComment` transform strips the `/** */` markers and leading asterisks, yielding the comment as plain text. Tags such as `@param` and `@returns` stay in the text; they are not parsed into structured fields.

## Grammar Relationships

When a separate JavaScript grammar is also registered (under the alias `js` here), Viola's `grammar()` rules control how the two interact per file pattern:

```typescript
// typescript overrides javascript for .ts/.tsx files
.rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"))

// typescript supplements javascript for .js/.jsx files (jsdoc types)
.rule(grammar("ts").supplements("js"), when.in("*.js", "*.jsx"))
```

### Override Semantics

When TypeScript **overrides** JavaScript (for `.ts`/`.tsx` files):
- Only the TypeScript grammar runs
- Full type information is extracted
- JavaScript grammar is suppressed

### Supplement Semantics

When TypeScript **supplements** JavaScript (for `.js`/`.jsx` files):
- JavaScript grammar runs first
- TypeScript grammar fills gaps (e.g., JSDoc type annotations)
- Results are merged, TypeScript data only where JS didn't capture

## Requirements

- Deno 2.0+
- `@hiisi/viola` ^0.3

## License

MPL-2.0
