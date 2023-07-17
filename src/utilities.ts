export const r = String.raw;

export function fromMaybeUndefined<T>(fallback: T, x?: T): T {
    return x === undefined ? fallback : x;
}

export function truncate(maxTotalLength: number, s: string): string {
    const REPLACEMENT = "[…]" as const;
    return (
        s.length > maxTotalLength
            ? s.slice(0, maxTotalLength - REPLACEMENT.length) + REPLACEMENT
            : s
    );
}

export function withMaybe<A, B>(ma: A | null, f: (x: A) => B): void {
    if (ma !== null) {
        f(ma);
    }
}

export function yyyymmdd(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1 /* 0-indexed */).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return yyyy + mm + dd;
}

export function assertExhausted(x: never): never {
    throw new Error(`assertExhausted: ${x}`);
}
