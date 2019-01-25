import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "../selectors";
import { processNode } from "@alling/better-sweclockers-lib";
import { STYLE_PROOFREADING } from "@alling/better-sweclockers-lib";
import { insertCSS, byID } from "lib/html";
import { removeById } from "../userscripter/misc";
import { withMaybe } from "../utilities";

export function performProcessing() {
    const selector = [ SELECTOR.bbParagraph, "h1", "h2", "h3" ].join(", ");
    document.querySelectorAll(selector).forEach(processNode);
}

export const enum Options {
    ALWAYS,
    CORRECTIONS,
    NEVER,
}

export function addListeners(e: { correctionsLink: HTMLElement }) {
    e.correctionsLink.addEventListener("click", _ => {
        enable();
        setTimeout(() => {
            withMaybe(document.querySelector(SELECTOR.proofDialogCloseButton), closeButton => {
                closeButton.addEventListener("click", disable, { capture: false, passive: true });
            });
        }, 100);
    }, {
        capture: false,
        passive: true,
    });
}

export function enable() {
    if (byID(CONFIG.ID.style.proofreading) === null) {
        insertCSS(STYLE_PROOFREADING, CONFIG.ID.style.proofreading);
    }
}

export function disable() {
    removeById(CONFIG.ID.style.proofreading);
}
