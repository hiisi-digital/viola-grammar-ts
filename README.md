# @hiisi/viola-grammar-ts

TypeScript and JavaScript grammar package for the [Viola](https://github.com/hiisi-digital/viola) convention linter.

## Overview

This package provides tree-sitter based parsing and extraction for TypeScript and JavaScript files. It extracts structured data (functions, types, imports, exports, strings) that Viola linters can analyze.

## Installation

```bash
deno add jsr:@hiisi/viola-grammar-ts
```

## Usage

```typescript
import { viola, grammar, when, report } from "@hiisi/viola";
import typescript from "@hiisi/viola-grammar-ts";
import javascript from "@hiisi/viola-grammar-js";

export default viola()
  // Register grammars
  .add(typescript).as("ts")
  .add(javascript).as("js")
  
  // TypeScript overrides JavaScript for .ts/.tsx files
  .rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"))
  
  // TypeScript supplements JavaScript for .js/.jsx files (JSDoc types)
  .rule(grammar("ts").supplements("js"), when.in("*.js", "*.jsx"))
  
  // Your linter rules
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
// Function declarations
function foo(a: string, b?: number): void { }

// Arrow functions
const bar = (x: number) => x * 2;

// Methods
class MyClass {
  method(arg: string): boolean { }
}

// Async/Generator
async function* generator() { yield 1; }
```

Captured data:
- Name
- Parameters (with types, defaults, rest, destructuring)
- Return type
- Body (raw and normalized)
- Flags: async, generator, exported, default export

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
- Kind (interface, type, enum)
- Fields with types
- Type parameters
- Extends clause

### Imports

```typescript
import foo from "module";           // default
import { bar } from "module";       // named
import { baz as qux } from "mod";   // renamed
import * as ns from "module";       // namespace
import type { T } from "module";    // type-only
```

Captured data:
- Imported name
- Local name (if renamed)
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
- Local name (if renamed)
- Kind (function, type, class, etc.)
- Source module (for re-exports)
- Type-only flag

### Strings

```typescript
const single = 'hello';
const double = "world";
const template = `Hello, ${name}!`;
```

Captured data:
- Value
- Quote style
- Template flag

### JSDoc

```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns The sum
 * @deprecated Use add() instead
 */
function sum(a: number, b: number): number { }
```

Extracted tags:
- Description
- @param
- @returns
- @deprecated
- @example

## Grammar Relationships

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
- `@hiisi/viola` ^0.1

## License

MPL-2.0
