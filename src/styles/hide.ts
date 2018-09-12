import { r } from "src/utilities";

export function hideById(i: string): string {
    return hideBySelector("#" + i);
}

export function hideByClass(c: string): string {
    return hideBySelector("." + c);
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
