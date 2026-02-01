/**
 * Test fixture: Simple TypeScript functions
 */

// Function declaration
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function
const add = (a: number, b: number): number => a + b;

// Async function
async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}

// Generator function
function* counter(): Generator<number> {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// Method in class
class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// Object method
const obj = {
  divide(a: number, b: number): number {
    return a / b;
  },
};

// Function with optional params
function optional(required: string, optional?: number, defaulted = 10): void {
  console.log(required, optional, defaulted);
}

// Function with rest params
function rest(first: string, ...rest: number[]): void {
  console.log(first, rest);
}

// Function with destructuring
function destructure({ x, y }: { x: number; y: number }): number {
  return x + y;
}
