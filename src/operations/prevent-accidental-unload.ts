import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "src/selectors";
import { FAILURE } from "lib/operation-manager";

export function postOrMessage(e: { textarea: HTMLElement }) {
    // We need to prevent unload if and only if the textarea contained text at
    // page load or if the user has edited its content at some point. Note that
    // the beforeunload listener cannot just check if the textarea is empty,
    // because the user can still undo/redo.
    const textarea = e.textarea as HTMLTextAreaElement;
    const changeListener = () => {
        addListener();
        textarea.removeEventListener("input", changeListener);
    }
    textarea.addEventListener("input", changeListener);
    const buttons = document.querySelectorAll(SELECTOR.actionButtons);
    Array.from(buttons).forEach(button => {
        button.addEventListener("click", removeListener);
    });
}

export function corrections() {
    // This function cannot take the corrections textarea as part of its `e`
    // parameter, because said textarea does not exist until user requests it.
    // We will prevent unload if the textarea exists and has some content; that
    // should be good enough.
    window.addEventListener("beforeunload", event => {
        const textarea = document.querySelector(`.${SITE.CLASS.proofDialog} textarea`) as HTMLTextAreaElement | null;
        // If the correction has been submitted, the textarea is not visible
        // anymore because one of its ancestors has display: none, in which case
        // textarea.offsetParent === null.
        if (textarea !== null && textarea.value !== "" && textarea.offsetParent !== null) {
            preventUnload(event);
        }
    });
}

function preventUnload(event: Event) {
    event.preventDefault();
    return event.returnValue = true;
}

function addListener() {
    window.addEventListener("beforeunload", preventUnload);
}

function removeListener() {
    window.removeEventListener("beforeunload", preventUnload);
}
