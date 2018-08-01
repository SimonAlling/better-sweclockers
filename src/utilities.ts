export const r = String.raw;

export function fromMaybeUndefined<T>(fallback: T, x?: T): T {
    return x === undefined ? fallback : x;
}
