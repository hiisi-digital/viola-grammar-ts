# Contributing to viola-grammar-ts

## Current Implementation Status

### ✅ Completed

- **Phase 1**: Foundation
  - Directory structure
  - Grammar definition structure
  - Type definitions (temporary until @hiisi/viola publishes)

- **Phase 2**: Extraction Queries
  - Function queries (declarations, arrows, methods, generators, async)
  - String queries (literals, templates)
  - Import queries (default, named, namespace, type-only)
  - Export queries (default, named, re-exports, type-only)
  - Type queries (interfaces, type aliases, enums)
  - Doc comment queries (JSDoc)

- **Phase 3**: Transform Functions (Stubs)
  - Parameter parsing (stub with interface)
  - Return type extraction (stub)
  - Body normalization (stub)
  - Export detection (stub)
  - Import parsing (stub)
  - Type field parsing (stub)
  - JSDoc parsing (stub)

- **Phase 4**: Testing
  - Grammar structure tests
  - Query pattern verification tests
  - Test fixtures for all major features

### 🚧 In Progress / Not Yet Implemented

The transform functions are currently stubs with complete documentation and type
signatures. They will be fully implemented when:

1. The Viola core framework is available
2. Tree-sitter integration can be tested end-to-end
3. Real-world usage patterns emerge

## Architecture

This package follows the **data-first** design principle:

- **Queries are primary**: Tree-sitter S-expression queries do most of the work
- **Transforms are secondary**: Only used for genuinely complex cases that
  queries can't handle
- **Types separate from logic**: All type definitions are in `src/types.ts`

## File Structure

```
viola-grammar-ts/
├── mod.ts                      # Public API
├── src/
│   ├── grammar.ts              # GrammarDefinition assembly
│   ├── types.ts                # Type definitions
│   ├── queries/                # Tree-sitter queries
│   │   ├── functions.ts
│   │   ├── strings.ts
│   │   ├── imports.ts
│   │   ├── exports.ts
│   │   ├── types.ts
│   │   └── docs.ts
│   └── transforms/             # Transform functions (stubs)
│       ├── params.ts
│       ├── return-type.ts
│       ├── normalize.ts
│       ├── exports.ts
│       ├── imports.ts
│       ├── types.ts
│       └── jsdoc.ts
└── tests/
    ├── grammar_test.ts         # Structure and query tests
    └── fixtures/               # Test fixtures
        ├── functions.ts
        ├── strings.ts
        ├── imports.ts
        ├── exports.ts
        └── types.ts
```

## Capture Naming Convention

All queries use standard Viola capture names:

```scheme
; Functions
@function.name    ; Function identifier
@function.params  ; Parameter list
@function.body    ; Function body
@function.return  ; Return type annotation
@function         ; Entire function node (for location)

; Strings
@string.value     ; String content
@string.template  ; Template literal marker

; Imports
@import.name      ; Imported identifier
@import.from      ; Source module path
@import.type_only ; Type-only import marker
@import           ; Entire import statement

; Exports
@export.name      ; Exported identifier
@export.kind      ; Export kind (function, class, etc.)
@export.from      ; Re-export source
@export           ; Entire export statement

; Types
@type.name        ; Type/interface name
@type.body        ; Type body
@type.kind        ; type vs interface vs enum
@type             ; Entire type declaration

; Documentation
@doc.content      ; JSDoc comment content
```

## Testing

Run tests with:

```bash
deno test
```

Type-check with:

```bash
deno check mod.ts
```

## Next Steps

To complete the implementation:

1. Wait for @hiisi/viola package to be published
2. Implement transform functions based on real usage patterns
3. Add integration tests with tree-sitter
4. Performance benchmarking
5. Real-world testing with TypeScript projects

## Questions?

Open an issue on GitHub: https://github.com/hiisi-digital/viola-grammar-ts
