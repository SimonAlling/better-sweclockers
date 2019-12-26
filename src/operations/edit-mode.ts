import * as SITE from "~src/site";

// Examples include `@Alling: `, `@Alling:` and `@"---": `.
const REGEX_POSSIBLY_CLEAN_SLATE_REPLY = /^@("?)([^"]+)\1: ?$/;

// Examples include `@Alling: `, `@Alling:` and `@"Better SweClockers": `.
export function isCleanSlate_reply(text: string): boolean {
    const match = text.match(REGEX_POSSIBLY_CLEAN_SLATE_REPLY);
    return match === null ? false : SITE.isValidUsername(match[2]);
}

export function mention(username: string): string {
    // It's non-trivial to write a sound and complete predicate that decides whether a username needs quotes or not.
    // One complicating factor is that some disallowed usernames have been allowed before (e.g. "simon.alling").
    // To avoid having to deal with this, we'll just always add quotes.
    return `@"${username}"`;
}
