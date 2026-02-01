# TODO - viola-grammar-ts

TypeScript/JavaScript grammar package for Viola convention linter.

## Phase 1: Foundation

### Setup
- [ ] Initialize deno.json with package metadata
- [ ] Set up imports for @hiisi/viola/grammars
- [ ] Configure tree-sitter-typescript npm dependency
- [ ] Create basic module structure

### Grammar Definition
- [ ] Create `src/grammar.ts` with GrammarDefinition
- [ ] Configure meta (id, name, extensions, globs)
- [ ] Configure grammar source (npm package reference)
- [ ] Export from mod.ts

## Phase 2: Extraction Queries

### Function Queries (`src/queries/functions.ts`)
- [ ] Function declarations
- [ ] Arrow functions (const/let/var)
- [ ] Method definitions (class methods)
- [ ] Generator functions
- [ ] Async functions
- [ ] Capture: name, params, body, return type
- [ ] Capture: async modifier, generator modifier

### String Queries (`src/queries/strings.ts`)
- [ ] String literals (single/double quotes)
- [ ] Template literals
- [ ] Template literal expressions
- [ ] Raw strings (String.raw)

### Import Queries (`src/queries/imports.ts`)
- [ ] Default imports
- [ ] Named imports
- [ ] Namespace imports (import * as)
- [ ] Type-only imports (import type)
- [ ] Side-effect imports (import "module")
- [ ] Dynamic imports (import())

### Export Queries (`src/queries/exports.ts`)
- [ ] Default exports
- [ ] Named exports
- [ ] Re-exports (export from)
- [ ] Export all (export * from)
- [ ] Type-only exports
- [ ] Declaration exports (export function, export class)

### Type Queries (`src/queries/types.ts`)
- [ ] Interface declarations
- [ ] Type alias declarations
- [ ] Enum declarations
- [ ] Capture: name, body, type parameters, extends

### Doc Comment Queries (`src/queries/docs.ts`)
- [ ] JSDoc block comments
- [ ] Capture: full comment content

## Phase 3: Transform Functions

### Parameter Parsing (`src/transforms/params.ts`)
- [ ] Simple parameter extraction
- [ ] Optional parameters (?)
- [ ] Default values (= value)
- [ ] Rest parameters (...args)
- [ ] Object destructuring parameters
- [ ] Array destructuring parameters
- [ ] Type annotations extraction
- [ ] Handle nested destructuring

### Return Type Extraction (`src/transforms/return-type.ts`)
- [ ] Explicit return type annotations
- [ ] Async return type unwrapping (Promise<T> → T)
- [ ] Generator return type handling

### Body Normalization (`src/transforms/normalize.ts`)
- [ ] Strip single-line comments
- [ ] Strip multi-line comments
- [ ] Normalize whitespace
- [ ] Preserve string literal content
- [ ] Handle template literal expressions

### Export Detection (`src/transforms/exports.ts`)
- [ ] Detect if node is exported
- [ ] Detect default export
- [ ] Handle export { name } pattern
- [ ] Handle export declarations

### Import Parsing (`src/transforms/imports.ts`)
- [ ] Parse import specifiers
- [ ] Handle renamed imports (as)
- [ ] Detect type-only imports
- [ ] Extract source module path

### Type Field Parsing (`src/transforms/types.ts`)
- [ ] Parse interface members
- [ ] Extract field names and types
- [ ] Detect optional fields
- [ ] Detect readonly fields
- [ ] Handle method signatures

### JSDoc Parsing (`src/transforms/jsdoc.ts`)
- [ ] Strip comment delimiters (/** */)
- [ ] Extract description text
- [ ] Parse @param tags
- [ ] Parse @returns tag
- [ ] Parse @deprecated tag
- [ ] Parse @example blocks
- [ ] Parse @throws/@throws tags
- [ ] Handle multi-line descriptions

## Phase 4: Testing

### Query Tests
- [ ] Test function query with various function forms
- [ ] Test string query with all string types
- [ ] Test import query with all import forms
- [ ] Test export query with all export forms
- [ ] Test type query with interfaces and type aliases
- [ ] Test doc comment query

### Transform Tests
- [ ] Test parseParams with complex parameters
- [ ] Test extractReturnType edge cases
- [ ] Test normalizeBody preserves semantics
- [ ] Test export detection accuracy
- [ ] Test import parsing completeness
- [ ] Test type field extraction
- [ ] Test JSDoc parsing

### Integration Tests
- [ ] Full extraction pipeline test
- [ ] Real-world TypeScript file tests
- [ ] Edge case handling
- [ ] Error recovery tests

## Phase 5: Documentation & Polish

### Documentation
- [ ] Complete README with usage examples
- [ ] Document all public exports
- [ ] Add JSDoc to all functions
- [ ] Create CHANGELOG.md

### Polish
- [ ] Ensure all tests pass
- [ ] Check TypeScript strict mode compliance
- [ ] Verify WASM loading works
- [ ] Test with viola core integration
- [ ] Performance benchmarking

## Notes

### Query Tips
- Use `#match?` predicates for filtering
- Prefer specific node types over wildcards
- Use alternations `[type1 type2]` for variants
- Capture the whole node with `@function` etc. for location

### Transform Tips
- Always handle undefined/null captures
- Use the source code slice for accurate text
- Cache parsed results when possible
- Handle error recovery gracefully

### Testing Strategy
- Each query should have corresponding test fixtures
- Test both positive matches and non-matches
- Include edge cases (empty bodies, no params, etc.)
- Test real-world code samples
