/**
 * Parameter parsing for TypeScript function parameters.
 *
 * Handles:
 * - Simple parameters with type annotations
 * - Optional parameters (?)
 * - Default values (= value)
 * - Rest parameters (...args)
 * - Object/array destructuring (as single param)
 *
 * @module
 */

import type { SyntaxNode } from "@hiisi/viola/grammars";
import type { FunctionParam } from "@hiisi/viola/data";

/**
 * Parse TypeScript function parameters from formal_parameters node.
 *
 * Walks the tree-sitter node children to extract parameter names,
 * types, optionality, defaults, and rest patterns.
 */
export function parseParams(
  paramsNode: SyntaxNode | undefined,
  _source: string,
): FunctionParam[] {
  if (!paramsNode) return [];

  const params: FunctionParam[] = [];

  for (const child of paramsNode.namedChildren) {
    const param = parseParamNode(child);
    if (param) params.push(param);
  }

  return params;
}

function parseParamNode(node: SyntaxNode): FunctionParam | null {
  switch (node.type) {
    case "required_parameter":
    case "optional_parameter": {
      const nameNode = node.childForFieldName("pattern")
        ?? node.childForFieldName("name");
      const typeNode = node.childForFieldName("type");
      const valueNode = node.childForFieldName("value");

      const name = nameNode ? extractParamName(nameNode) : node.text;
      const type = typeNode?.text;
      const optional = node.type === "optional_parameter";
      const defaultValue = valueNode?.text;

      return {
        name,
        type,
        optional: optional || defaultValue !== undefined,
        rest: false,
        defaultValue,
      };
    }

    case "rest_parameter": {
      const nameNode = node.childForFieldName("pattern")
        ?? node.childForFieldName("name");
      const typeNode = node.childForFieldName("type");

      return {
        name: nameNode ? extractParamName(nameNode) : node.text.replace(/^\.\.\./, ""),
        type: typeNode?.text,
        optional: true,
        rest: true,
      };
    }

    default:
      // Unknown parameter form — extract name from text
      return {
        name: node.text.split(":")[0]?.split("=")[0]?.trim().replace(/^\.\.\.|[?]$/g, "") ?? node.text,
        optional: node.text.includes("?") || node.text.includes("="),
        rest: node.text.startsWith("..."),
      };
  }
}

function extractParamName(node: SyntaxNode): string {
  switch (node.type) {
    case "identifier":
      return node.text;
    case "object_pattern":
      return `{${node.namedChildren.map(c => c.childForFieldName("name")?.text ?? c.text).join(", ")}}`;
    case "array_pattern":
      return `[${node.namedChildren.map(c => c.text).join(", ")}]`;
    default:
      return node.text;
  }
}
