import { byID, isHTMLElement } from ".userscripter/lib/html";

import * as CONFIG from "src/globals-config";

export function hasAlreadyRun(): boolean {
    return isHTMLElement(byID(CONFIG.ID_STYLE_ELEMENT));
}

export function removeById(id: string): void {
    const element = byID(id);
    if (element !== null) {
        element.remove();
    }
}
