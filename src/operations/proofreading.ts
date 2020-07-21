import { CLASS as BSCLibClass, processNode } from "@alling/better-sweclockers-lib";
import { stylesheets } from "userscripter";

import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import STYLESHEETS from "~src/stylesheets";
import { withMaybe } from "~src/utilities";

const CONTEXT_CHARS = 10; // before and after mistake
// If a previous and/or next sibling is not found, look outside these elements:
const ELEMENTS_TO_GO_OUTSIDE = [
    "em",
    "span",
    "strong",
    "sub",
    "sup",
].map(x => x.toUpperCase()); // because .tagName is upper case

export function performProcessing() {
    const selector = [ SELECTOR.bbParagraph, "h1", "h2", "h3" ].join(", ");
    for (const n of document.querySelectorAll(selector)) {
        processNode(n);
    }
    for (const mistake of document.querySelectorAll("."+BSCLibClass.MARK.mistake)) {
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
    }
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
    stylesheets.enable(STYLESHEETS.proofread_forum_posts);
}

export function disable() {
    stylesheets.disable(STYLESHEETS.proofread_forum_posts);
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

function contextBeforeOrAfter(
    getSibling: (mistake: Node) => Node | null,
    combine: (text: string, nextContext: string) => string,
    baseCase: (text: string, maxChars: number) => string,
): (mistake: Node, maxChars: number) => string {
    return (mistake, maxChars) => {
        const recurse = contextBeforeOrAfter(getSibling, combine, baseCase);
        const sibling = getSibling(mistake);
        if (sibling === null) {
            const parent = mistake.parentElement as HTMLElement;
            return (
                ELEMENTS_TO_GO_OUTSIDE.includes(parent.tagName)
                ? recurse(parent, maxChars)
                : ""
            );
        }
        const text = sibling.textContent || "";
        return (
            text.length < maxChars
            ? combine(text, recurse(sibling, maxChars - text.length))
            : baseCase(text, maxChars)
        );
    };
}

const contextBefore = contextBeforeOrAfter(
    n => n.previousSibling,
    (text, nextContext) => nextContext + text,
    (text, maxChars) => text.substring(text.length - maxChars),
);

const contextAfter = contextBeforeOrAfter(
    n => n.nextSibling,
    (text, nextContext) => text + nextContext,
    (text, maxChars) => text.substring(0, maxChars),
);
