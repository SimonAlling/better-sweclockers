export const r = String.raw;

export function fromMaybeUndefined<T>(fallback: T, x?: T): T {
    return x === undefined ? fallback : x;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function assertUnreachable(x: never): never {
    throw new Error(`assertUnreachable: ${x}`);
}
