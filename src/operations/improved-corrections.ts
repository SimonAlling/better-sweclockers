import { isHTMLElement } from ".userscripter/lib/html";

import * as SITE from "src/globals-site";
import { withMaybe } from "src/utilities";

export default (e: { correctionsLink: HTMLElement }) => {
    e.correctionsLink.addEventListener("click", event => {
        withMaybe(document.querySelector("." + SITE.CLASS.proofDialog), proofDialog => {
            event.stopImmediatePropagation();
            const textarea = proofDialog.querySelector("textarea");
            if (isHTMLElement(textarea)) {
                textarea.focus();
            }
        });
    }, true);
}
