import { isHTMLElement, byID } from "lib/html";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

export function hasAlreadyRun(): boolean {
    return isHTMLElement(byID(CONFIG.ID_STYLE_ELEMENT));
}

export function removeById(id: string): void {
    const element = byID(id);
    if (element !== null) {
        element.remove();
    }
}
