import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { h, render } from "preact";
import { isHTMLElement } from "lib/html";

export default (e: { correctionsLink: HTMLElement }) => {
    e.correctionsLink.addEventListener("click", event => {
        const proofDialog = document.querySelector("." + SITE.CLASS.proofDialog);
        if (proofDialog !== null) {
            event.stopImmediatePropagation();
            const textarea = proofDialog.querySelector("textarea");
            if (isHTMLElement(textarea)) {
                textarea.focus();
            }
        }
    }, true);
}
