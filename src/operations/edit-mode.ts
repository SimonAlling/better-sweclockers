import * as SITE from "../globals-site";
import * as CONFIG from "../globals-config";

// Examples include `@Alling: `, `@Alling:` and `@"---": `.
const REGEX_POSSIBLY_CLEAN_SLATE_REPLY = /^@("?)([^"]+)\1: ?$/;

// Examples include `@Alling: `, `@Alling:` and `@"Better SweClockers": `.
export function isCleanSlate_reply(text: string): boolean {
    const match = text.match(REGEX_POSSIBLY_CLEAN_SLATE_REPLY);
    return match === null ? false : SITE.isValidUsername(match[2]);
}
