export function startTag(tagName: string, parameter?: string): string {
    return `[${tagName}${parameter === undefined ? "" : `="${parameter}"`}]`;
}

export function endTag(tagName: string): string {
    return `[/${tagName}]`;
}

export function empty(tagName: string): string {
    return startTag(tagName) + endTag(tagName);
}
