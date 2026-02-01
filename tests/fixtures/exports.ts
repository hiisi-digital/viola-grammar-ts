/**
 * Test fixture: Export statements
 */

// Export declaration
export function exportedFn() {}

// Export class
export class ExportedClass {}

// Export const
export const exportedConst = 42;

// Named export
const localVar = "value";
export { localVar };

// Renamed export
export { localVar as renamedVar };

// Default export
export default function defaultFn() {}

// Re-export
export { something } from "./other";

// Re-export all
export * from "./other";

// Re-export namespace
export * as ns from "./other";

// Type-only export
export type { TypeName } from "./types";

// Interface export
export interface ExportedInterface {
  prop: string;
}
