# `viola-grammar-ts`

> TypeScript grammar for the viola convention linter.

A tree-sitter based grammar package for [viola](https://github.com/hiisi-digital/viola) that parses `.ts`, `.tsx`, `.mts` and `.cts` files and extracts the structured data viola's linters analyze, which is functions, types, imports, exports and strings.

## Usage

```bash
deno add jsr:@hiisi/viola-grammar-ts
```

```typescript
import { report, viola, when } from "@hiisi/viola";
import typescript from "@hiisi/viola-grammar-ts";

export default viola()
  // register the grammar
  .add(typescript).as("ts")
  // your linter rules
  .rule(report.error, when.in("src/**"));
```

## What it extracts

Functions come from declarations, arrow functions, methods and generators, with the name, the parameters (types, optionality, defaults, rest and destructuring), the return type, the raw and normalized body and whether it is exported. Types are interfaces, type aliases and enums, with their fields, which covers properties, method signatures, index signatures and enum members, and the same body and exported flag. Imports give one entry per imported name, with the local alias when renamed, the source module and the type-only and namespace flags, exports give the name, the source module for re-exports and the type-only flag, and strings give the value with quotes stripped and whether it is a template.

The grammar declares a doc-comment query and a `parseDocComment` transform for JSDoc, and viola's extraction doesn't run either, so no doc-comment data reaches a linter yet.

## Next to a JavaScript grammar

When a separate JavaScript grammar is registered too, viola's `grammar()` rules decide how the two interact on a shared file.

```typescript
// typescript overrides javascript where both claim the file
.rule(grammar("ts").overrides("js"), when.in("*.ts", "*.tsx"))
```

With `overrides` only the TypeScript grammar runs on the file, with full type information, and with `supplements` the JavaScript grammar runs first and the TypeScript results are merged in only where it captured nothing. A relationship applies only to a file both grammars already match, and this package registers just the four TypeScript extensions, so on a `.js` or `.jsx` file a rule naming it has no effect. It needs deno 2.0 or newer and `@hiisi/viola` ^0.3.

## License

> The project is licensed under the **Mozilla Public License 2.0**.

`SPDX-License-Identifier: MPL-2.0`

> You can check out the full license [here](https://github.com/hiisi-digital/viola-grammar-ts/blob/main/LICENSE)
