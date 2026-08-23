import type { SyntaxNode } from "@hiisi/viola/grammars";

/**
 * The tree-sitter node types and field names these transforms match on.
 *
 * Named in one place because a node type spelled out at each use is a string
 * two files can disagree about silently: tree-sitter answers with whatever it
 * has, and a transform testing for the wrong spelling simply never fires.
 *
 * @module
 */

/** A bare name. */
export const IDENTIFIER = "identifier";

/** The field a destructured parameter arrives under. */
export const PATTERN_FIELD = "pattern";

/** The modifier that makes a member read-only. */
export const READONLY_KEYWORD = "readonly";

/**
 * Parse every named child that parses, in order.
 *
 * `parseParams` and `parseTypeFields` are this loop around a different
 * per-child parser, and each carried its own copy of the absent-node guard,
 * the accumulator and the null check.
 */
export function collectNamed<T>(
  node: { readonly namedChildren: readonly SyntaxNode[] } | undefined,
  parse: (child: SyntaxNode) => T | null,
): T[] {
  if (node === undefined) return [];
  const found: T[] = [];
  for (const child of node.namedChildren) {
    const one = parse(child);
    if (one !== null) found.push(one);
  }
  return found;
}
