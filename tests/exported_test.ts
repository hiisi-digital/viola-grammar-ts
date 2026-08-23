/**
 * What counts as exported.
 *
 * The walk looks upward for an `export_statement`, and everything it does not
 * stop at, it walks through. A closure inside an exported function found that
 * function's `export` and was reported as an exported function itself, so
 * `missing-docs` demanded JSDoc on every private helper and `orphaned-code`
 * looked for imports of names nothing outside can even reach.
 */

import { assertEquals } from "@std/assert";
import typescript from "../mod.ts";
import {
  createParser,
  extractFileData,
  initTreeSitter,
  loadGrammar,
} from "@hiisi/viola/grammars";

async function exportedNames(source: string): Promise<Record<string, boolean>> {
  await initTreeSitter();
  const language = await loadGrammar(typescript.grammar);
  const parser = createParser(typescript.grammar, language);
  const tree = parser.parse(source);
  const data = extractFileData(tree, language, typescript, "a.ts", source);
  return Object.fromEntries(
    data.functions.map((f) => [f.name, f.isExported]),
  );
}

Deno.test("exported - a closure inside an exported function is not exported", async () => {
  const found = await exportedNames(
    "export function outer(): void {\n" +
      "  const inner = (x: number): void => { console.log(x); };\n" +
      "  inner(1);\n" +
      "}\n",
  );
  assertEquals(found.outer, true, "the function that owns the block still is");
  assertEquals(found.inner, false);
});

Deno.test("exported - an exported arrow at the top level is exported", async () => {
  // The control. Stopping at a statement block must not hide a function that
  // happens to have one.
  const found = await exportedNames("export const top = (): void => {};\n");
  assertEquals(found.top, true);
});

Deno.test("exported - an unexported top-level function is not exported", async () => {
  const found = await exportedNames("function plain(): void {}\n");
  assertEquals(found.plain, false);
});

Deno.test("exported - a method is not an export of its class", async () => {
  // The case the class-body stop already covered, kept so the two stops are
  // pinned together: neither is a special case of the other.
  const found = await exportedNames(
    "export class Thing {\n  do(): void {}\n}\n",
  );
  assertEquals(found.do, false);
});
