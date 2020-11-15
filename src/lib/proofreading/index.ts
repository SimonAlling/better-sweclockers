import { RULES, RULES_SUP, PATTERN_DOPPELGANGERS } from "@alling/sweclockers-writing-rules";
import { compose } from "@typed/compose";
import { proofreadWith, highlightWith } from "highlight-mistakes";

import C from "./classes";

type StringTransformer = (s: string) => string;

export function processNodeWith(f: StringTransformer, sup: StringTransformer): (node: Node) => void {
    return node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement("span");
            span.innerHTML = f(escapeHTML(node.textContent || ""));
            (node.parentNode as Node).replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === "SUP") {
                (node as HTMLElement).innerHTML = sup(node.textContent || "");
            } else {
                Array.from(node.childNodes).forEach(processNodeWith(f, sup));
            }
        }
    };
}

export function markWith(className: string): (info: string | null) => StringTransformer {
    const isMistake = className === C.mistake;
    return info => s => [
        `<span class="${C.proofread} ${className}"`,
        (isMistake && info !== null ? ` title="Förslag: ${info}"` : ""),
        `>${s}</span>`,
    ].join("");
}

export const processSup = proofreadWith({
    rules: RULES_SUP,
    markMistake: markWith(C.mistake),
    markVerified: markWith(C.verified),
});

export const processText = compose(
    highlightWith({
        pattern: PATTERN_DOPPELGANGERS,
        mark: markWith(C.any)(null),
    }),
    proofreadWith({
        rules: RULES,
        markMistake: markWith(C.mistake),
        markVerified: markWith(C.verified),
    }),
);

export const processNode = processNodeWith(processText, processSup);

function replacer(found: `&` | `<` | `>` | `"` | `'`): string {
    switch (found) {
        case `&`: return "&amp;";
        case `<`: return "&lt;";
        case `>`: return "&gt;";
        case `"`: return "&quot;";
        case `'`: return "&#039;"; // https://stackoverflow.com/questions/2083754
    }
}

function escapeHTML(html: string): string {
    return html.replace(/[&<>"']/g, replacer as (substring: string) => string);
}
