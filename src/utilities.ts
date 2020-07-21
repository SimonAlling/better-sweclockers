export const r = String.raw;

export function fromMaybeUndefined<T>(fallback: T, x?: T): T {
    return x === undefined ? fallback : x;
}

export function withMaybe<A, B>(ma: A | null, f: (x: A) => B): void {
    if (ma !== null) {
        f(ma);
    }
}
