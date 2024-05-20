export function mention(username: string): string {
    // It's non-trivial to write a sound and complete predicate that decides whether a username needs quotes or not.
    // One complicating factor is that some disallowed usernames have been allowed before (e.g. "simon.alling").
    // To avoid having to deal with this, we'll just always add quotes.
    return `@"${username}"`;
}
