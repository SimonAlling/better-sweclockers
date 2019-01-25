import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { h, render } from "preact";
import { isHTMLElement } from "lib/html";
import { withMaybe } from "../utilities";

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
