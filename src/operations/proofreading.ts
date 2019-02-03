import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "../selectors";
import { processNode, CLASS as BSCLibClass, STYLE_PROOFREADING } from "@alling/better-sweclockers-lib";
import { insertCSS, byID } from "lib/html";
import { removeById } from "../userscripter/misc";
import { withMaybe } from "../utilities";

const CONTEXT_CHARS = 10; // before and after mistake

export function performProcessing() {
    const selector = [ SELECTOR.bbParagraph, "h1", "h2", "h3" ].join(", ");
    document.querySelectorAll(selector).forEach(processNode);
    document.querySelectorAll("."+BSCLibClass.MARK.mistake).forEach(mistake => {
        mistake.addEventListener("click", () => {
            if (getProofDialogTextarea() === null) {
                withMaybe(document.getElementById(SITE.ID.correctionsLink), correctionsLink => {
                    correctionsLink.click();
                });
            }
            // Wait for proof dialog to appear:
            setTimeout(() => {
                withMaybe(getProofDialogTextarea(), textarea => {
                    addCorrection(textarea, {
                        context: context(mistake),
                        suggestion: (mistake as HTMLElement).title,
                    });
                });
            }, 10);
        });
    });
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
        }, 10);
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

function getProofDialogTextarea(): HTMLTextAreaElement | null {
    return document.querySelector(SELECTOR.proofDialogTextarea) as HTMLTextAreaElement | null;
}

function addCorrection(textarea: HTMLTextAreaElement, correction: {
    context: string,
    suggestion: string,
}): void {
    textarea.value = (textarea.value.trim() + [
        "", "", "",
        correction.context,
        "",
        correction.suggestion,
    ].join("\n")).trim();
    textarea.scrollTo(0, Number.MAX_SAFE_INTEGER);
    textarea.focus();
    // Corrections are not submitted unless there has been a change event on the textarea.
    textarea.dispatchEvent(new Event("change"));
}

function context(mistake: Node): string {
    return [
        contextBefore(mistake, CONTEXT_CHARS),
        mistake.textContent as string,
        contextAfter(mistake, CONTEXT_CHARS),
    ].join("");
}

function contextBefore(mistake: Node, maxChars: number): string {
    const sibling = mistake.previousSibling;
    if (sibling === null) {
        return "";
    }
    const text = sibling.textContent || "";
    const textLength = text.length;
    return (
        textLength < maxChars
        ? contextBefore(sibling, maxChars - textLength) + text
        : text.substring(textLength - maxChars)
    );
}

function contextAfter(mistake: Node, maxChars: number): string {
    const sibling = mistake.nextSibling;
    if (sibling === null) {
        return "";
    }
    const text = sibling.textContent || "";
    const textLength = text.length;
    return (
        textLength < maxChars
        ? text + contextAfter(sibling, maxChars - textLength)
        : text.substring(0, maxChars)
    );
}
