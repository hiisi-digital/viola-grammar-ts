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

The grammar declares a doc-comment query (`(comment) @doc.content`) and a `parseDocComment` transform that strips the `/** */` markers and leading asterisks. Viola does not run either one: its extraction pass produces functions, types, imports, exports and strings only, so no doc-comment data reaches a linter. The query and the transform are declared against a pipeline stage that does not exist yet.

## Grammar Relationships

When a separate JavaScript grammar is also registered (under the alias `js` here), Viola's `grammar()` rules control how the two interact per file pattern:

```typescript
// typescript overrides javascript where both claim the file
.rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"))
```

A relationship applies only to a file both grammars already match. Viola resolves the matching set from each grammar's registered extensions first, and skips any relationship whose primary or secondary is absent from that set. This package registers `.ts`, `.tsx`, `.mts` and `.cts` and nothing else, so a relationship changes the outcome only where the JavaScript grammar claims those same extensions. On a `.js` or `.jsx` file this grammar is not in the matching set at all, and a rule naming it there has no effect.

### Override Semantics

When TypeScript **overrides** JavaScript on a file both match:
- Only the TypeScript grammar runs
- Full type information is extracted
- JavaScript grammar is suppressed

### Supplement Semantics

When TypeScript **supplements** JavaScript on a file both match:
- JavaScript grammar runs first
- TypeScript grammar fills gaps
- Results are merged, TypeScript data only where JS didn't capture

## Requirements

- Deno 2.0+
- `@hiisi/viola` ^0.3

## License

MPL-2.0
