/**
 * Type field parsing for TypeScript interfaces and type aliases.
 *
 * Extracts field names and types from:
 * - Interface body (object_type)
 * - Enum body (enum_body)
 *
 * @module
 */

/** What a field's type is when the source did not annotate one. */
const UNANNOTATED = "unknown";

import { collectNamed, READONLY_KEYWORD } from "./nodes.ts";

import type { SyntaxNode } from "@hiisi/viola/grammars";
import type { TypeField } from "@hiisi/viola/data";

/**
 * Parse type fields from an interface or type body node.
 *
 * Walks the node's named children to extract property signatures,
 * method signatures, and index signatures.
 */
export function parseTypeFields(
  bodyNode: SyntaxNode | undefined,
  _source: string,
): TypeField[] {
  return collectNamed(bodyNode, parseFieldNode);
}

function parseFieldNode(node: SyntaxNode): TypeField | null {
  switch (node.type) {
    case "property_signature": {
      const nameNode = node.childForFieldName("name");
      const typeNode = node.childForFieldName("type");
      const optional = node.children.some((c) =>
        c.type === "?" || c.text === "?"
      );
      return {
        name: nameNode?.text ?? node.text.split(/[?:]/)[0]!.trim(),
        type: typeNode?.text?.replace(/^\s*:\s*/, "").trim() ?? UNANNOTATED,
        optional,
        readonly: node.children.some((c) => c.text === READONLY_KEYWORD),
      };
    }

    case "method_signature": {
      const nameNode = node.childForFieldName("name");
      return {
        name: nameNode?.text ?? UNANNOTATED,
        type: "method",
        optional: node.children.some((c) => c.type === "?" || c.text === "?"),
        readonly: false,
      };
    }

    case "index_signature": {
      return {
        name: "[index]",
        type: node.text,
        optional: false,
        readonly: node.children.some((c) => c.text === READONLY_KEYWORD),
      };
    }

    case "enum_assignment": {
      const nameNode = node.childForFieldName("name");
      const valueNode = node.childForFieldName("value");
      return {
        name: nameNode?.text ?? node.text.split("=")[0]!.trim(),
        type: valueNode?.text ?? UNANNOTATED,
        optional: false,
        readonly: true,
      };
    }

    default:
      return null;
  }
}
