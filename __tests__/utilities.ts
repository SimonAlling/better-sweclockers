// Pure (not in-place) sort function.
export function sorted<T>(xs: readonly T[]): T[] {
    return xs.slice().sort();
}
