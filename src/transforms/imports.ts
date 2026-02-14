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

  const isTypeOnly = captures.has("import.type_only")
    || node.children.some(c => c.type === "type");

  // Check for namespace import: import * as name from "mod"
  // The query captures the identifier as @import.name, so also check the AST
  // for a namespace_import node inside import_clause.
  const namespaceCapture = captures.get("import.namespace");
  const importClauseForNs = node.children.find(c => c.type === "import_clause");
  const namespaceImport = importClauseForNs?.children.find(c => c.type === "namespace_import");
  if (namespaceCapture || namespaceImport) {
    const name = namespaceCapture?.text
      ?? namespaceImport?.namedChildren.find(c => c.type === "identifier")?.text
      ?? captures.get("import.name")?.text
      ?? "default";
    return {
      name,
      from,
      location,
      isTypeOnly,
      isNamespace: true,
    };
  }

  // Check for named imports: import { a, b } from "mod"
  const importClause = node.children.find(c => c.type === "import_clause");
  const namedImports = importClause?.children.find(c => c.type === "named_imports");

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
    name: nameCapture?.text ?? "default",
    from,
    location,
    isTypeOnly,
    isNamespace: false,
  };
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
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
