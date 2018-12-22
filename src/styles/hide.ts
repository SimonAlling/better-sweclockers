import { r } from "src/utilities";
import { isString } from "ts-type-guards";

export function hideById(i: string): string {
    return hideBySelector("#" + i);
}

export function hideByClass(c: string | ReadonlyArray<string>): string {
    return hideBySelector(isString(c) ? "."+c : c.map(x => "."+x).join(", "));
}

export function hideBySelector(selector: string): string {
    return (
r`
${selector} {
    display: none !important;
}
`
    );
}
