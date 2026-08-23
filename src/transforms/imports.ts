/**
 * Import parsing for TypeScript import statements.
 *
 * Handles:
 * - Default imports: import foo from "module"
 * - Named imports: import { foo, bar } from "module"
 * - Namespace imports: import * as foo from "module"
 * - Type-only imports: import type { Foo } from "module"
 * - Side-effect imports: import "module"
 *
 * @module
 */

import { IDENTIFIER } from "./nodes.ts";

/** What an import with no name of its own is called. */
const DEFAULT_IMPORT = "default";

import type { QueryCaptures, SyntaxNode } from "@hiisi/viola/grammars";
import type { ImportInfo, SourceLocation } from "@hiisi/viola/data";

/**
 * Parse a TypeScript import statement into one or more ImportInfo entries.
 *
 * A single import statement with named imports produces multiple entries
 * (one per imported name).
 */
export function parseImport(
  node: SyntaxNode,
  captures: QueryCaptures,
  _source: string,
): ImportInfo | ImportInfo[] {
  const fromCapture = captures.get("import.from");
  const from = fromCapture ? stripQuotes(fromCapture.text) : "";
  const location = nodeToLocation(node);

  const isTypeOnly = captures.has("import.type_only") ||
    node.children.some((c) => c.type === "type");

  // A re-export is an import for every purpose a lint cares about.
  //
  // `export { thing } from "./mod.ts"` names a symbol and pulls it from another
  // module, which is exactly what an import does, and a barrel re-exporting a
  // package's surface is the strongest evidence a symbol is public. Everything
  // below reads `import_clause` and `named_imports`, which exist only under an
  // `import_statement`, so an `export_statement` fell through to the default
  // branch and produced a single import named "default".
  //
  // The visible symptom was the orphaned-code lint reporting every re-exported
  // symbol as never imported, which in a package built around a `mod.ts` is
  // every public symbol it has.
  if (node.type === "export_statement") {
    const clause = node.children.find((c) => c.type === "export_clause");
    const specifiers = clause?.namedChildren.filter((c) =>
      c.type === "export_specifier"
    ) ?? [];
    const named = specifiers
      .map((spec) => spec.childForFieldName("name")?.text)
      .filter((name): name is string => name !== undefined && name.length > 0);

    // `export * from "..."` names nothing but still uses the module.
    return named.length > 0
      ? named.map((name) => ({
        name,
        from,
        location,
        isTypeOnly,
        isNamespace: false,
      }))
      : { name: "*", from, location, isTypeOnly, isNamespace: true };
  }

  // Check for namespace import: import * as name from "mod"
  // The query captures the identifier as @import.name, so also check the AST
  // for a namespace_import node inside import_clause.
  const namespaceCapture = captures.get("import.namespace");
  const importClauseForNs = node.children.find((c) =>
    c.type === "import_clause"
  );
  const namespaceImport = importClauseForNs?.children.find((c) =>
    c.type === "namespace_import"
  );
  if (namespaceCapture || namespaceImport) {
    const name = namespaceCapture?.text ??
      namespaceImport?.namedChildren.find((c) => c.type === IDENTIFIER)?.text ??
      captures.get("import.name")?.text ??
      DEFAULT_IMPORT;
    return {
      name,
      from,
      location,
      isTypeOnly,
      isNamespace: true,
    };
  }

  // Check for named imports: import { a, b } from "mod"
  const importClause = node.children.find((c) => c.type === "import_clause");
  const namedImports = importClause?.children.find((c) =>
    c.type === "named_imports"
  );

  if (namedImports) {
    const results: ImportInfo[] = [];
    for (const specifier of namedImports.namedChildren) {
      if (specifier.type !== "import_specifier") continue;
      const nameNode = specifier.childForFieldName("name");
      const aliasNode = specifier.childForFieldName("alias");
      if (nameNode) {
        results.push({
          name: aliasNode?.text ?? nameNode.text,
          from,
          location: nodeToLocation(nameNode),
          isTypeOnly,
          isNamespace: false,
        });
      }
    }
    if (results.length > 0) return results;
  }

  // Default import or single name capture
  const nameCapture = captures.get("import.name");
  return {
    name: nameCapture?.text ?? DEFAULT_IMPORT,
    from,
    location,
    isTypeOnly,
    isNamespace: false,
  };
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function nodeToLocation(node: SyntaxNode): SourceLocation {
  return {
    file: "",
    line: node.startPosition.row + 1,
    column: node.startPosition.column,
    endLine: node.endPosition.row + 1,
    endColumn: node.endPosition.column,
  };
}
