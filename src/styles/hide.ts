import { isString } from "ts-type-guards";

import { r } from "src/utilities";

export function hideById(i: string): string {
    return hideBySelector("#" + i);
}

export function hideByClass(c: string | readonly string[]): string {
    return hideBySelector(isString(c) ? "."+c : c.map(x => "."+x).join(", "));
}

export function hideBySelector(selector: string): string {
    return (
r`
${selector} {
    display: none;
}
`
    );
}
