import { fmap_null } from "fmap-null-undefined";

export const r = String.raw;

export function fromMaybeUndefined<T>(fallback: T, x?: T): T {
    return x === undefined ? fallback : x;
}

export function assertUnreachable(x: never): never {
    throw new Error(`assertUnreachable: ${x}`);
}

export function withMaybe<A, B>(ma: A | null, f: (x: A) => B): B | null {
    return fmap_null(f)(ma);
}
