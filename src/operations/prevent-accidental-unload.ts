import * as SITE from "~src/globals-site";
import SELECTOR from "~src/selectors";
import { withMaybe } from "~src/utilities";

// mousedown because it must be guaranteed to fire before beforeunload:
export const BUTTON_CLICK_EVENT = "mousedown";

// I prefer this to fiddling with event listeners:
let shouldPreventUnload = false;

export function postOrMessage(e: {
    textarea: HTMLElement,
    _actionButtons: HTMLElement, // because we want to extract them using document.querySelectorAll
}) {
    // We need to prevent unload if the user has modified the content of the
    // textarea or if they came here by clicking the preview button.
    window.addEventListener("beforeunload", handleBeforeUnload);
    const textarea = e.textarea as HTMLTextAreaElement;
    const changeListener = () => {
        enableListener();
        textarea.removeEventListener("input", changeListener);
    }
    textarea.addEventListener("input", changeListener);
    document.querySelectorAll(SELECTOR.actionButtons).forEach(button => {
        button.addEventListener(BUTTON_CLICK_EVENT, disableListener);
    });
    // If a post preview exists, then the user came here by previewing, so there
    // is information to be lost even before they have touched the textarea:
    withMaybe(document.getElementById(SITE.ID.postPreview), enableListener);
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

function handleBeforeUnload(event: Event) {
    if (shouldPreventUnload) preventUnload(event);
}

function preventUnload(event: Event) {
    event.preventDefault();
    return event.returnValue = true;
}

function enableListener() {
    shouldPreventUnload = true;
}

function disableListener() {
    shouldPreventUnload = false;
}
