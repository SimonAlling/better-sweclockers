import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "src/selectors";
import { FAILURE } from "lib/operation-manager";

export default (e: { textarea: HTMLElement }) => {
    // We need to prevent unload if and only if the textarea contained text at
    // page load or if the user has edited its content at some point. Note that
    // the beforeunload listener cannot just check if the textarea is empty,
    // because the user can still undo/redo.
    const textarea = e.textarea as HTMLTextAreaElement;
    const changeListener = () => {
        addListener();
        textarea.removeEventListener("change", changeListener);
    }
    if (textarea.value === "") {
        textarea.addEventListener("change", changeListener);
    } else {
        addListener();
    }
    const buttons = document.querySelectorAll(SELECTOR.actionButtons);
    Array.from(buttons).forEach(button => {
        button.addEventListener("click", removeListener);
    });
}

function preventUnload(event: Event) {
    return event.returnValue = true;
}

function addListener() {
    window.addEventListener("beforeunload", preventUnload);
}

function removeListener() {
    window.removeEventListener("beforeunload", preventUnload);
}
