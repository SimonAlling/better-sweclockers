import { is } from "ts-type-guards";

import * as SITE from "~src/site";

import { wrap_tag } from "./logic/textarea";

export default (e: {
    textarea: HTMLElement,
    toolbarInner: HTMLElement,
}) => {
    const REPLACEMENTS = {
        // The key is the class we use to identify the button to replace.
        bold: wrap_tag({ tag: SITE.TAG.b, parameterized: false, block: false }),
        italic: wrap_tag({ tag: SITE.TAG.i, parameterized: false, block: false }),
        underline: wrap_tag({ tag: SITE.TAG.u, parameterized: false, block: false }),
        strike: wrap_tag({ tag: SITE.TAG.s, parameterized: false, block: false }),
    } as const;
    for (const [ buttonClass, action ] of Object.entries(REPLACEMENTS)) {
        const buttonToReplace = e.toolbarInner.querySelector(`.${SITE.CLASS.toolbarButton}.${buttonClass}`);
        if (!is(HTMLElement)(buttonToReplace)) {
            return `'${buttonClass}' toolbar button was not found.`;
        }
        const clonedButton = buttonToReplace.cloneNode(true);
        clonedButton.addEventListener("click", () => {
            action(e.textarea as HTMLTextAreaElement, true); // (The purpose of this entire operation is to enable undo support.)
        });
        buttonToReplace.replaceWith(clonedButton);
    }
};
