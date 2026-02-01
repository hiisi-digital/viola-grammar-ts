/**
 * Test fixture: Type declarations
 */

// Interface
interface User {
  id: number;
  name: string;
  email?: string;
  readonly createdAt: Date;
}

// Type alias
type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

// Enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

// Generic interface
interface Repository<T> {
  find(id: string): Promise<T>;
  save(item: T): Promise<void>;
}

// Extends clause
interface Admin extends User {
  permissions: string[];
}

// Union type
type StringOrNumber = string | number;

// Intersection type
type NamedEntity = { name: string } & { id: number };
