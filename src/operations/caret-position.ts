import * as Storage from "ts-storage";

import * as CONFIG from "~src/config";
import { P, Preferences } from "~src/preferences";

export default (e: {
    textarea: HTMLTextAreaElement,
    previewButton: HTMLButtonElement,
}) => {
    // Caret position is only saved when the user requests a preview; it is
    // wiped on any other page unload.
    const textarea = e.textarea;
    const savedPosition = Storage.get_session(CONFIG.KEY.caret_position, NaN).value;
    // The check below is done here instead of as a condition for the entire
    // operation, because we need the wiping to be done even if the user has
    // disabled remember_caret_position.
    if (Preferences.get(P.edit_mode._.remember_caret_position) && isNaturalNumber(savedPosition)) {
        placeCaretIn(textarea, savedPosition);
    }
    const wipeSavedPosition = () => Storage.remove_session(CONFIG.KEY.caret_position);
    window.addEventListener("unload", wipeSavedPosition);
    e.previewButton.addEventListener("click", () => {
        savePositionIn(textarea);
        window.removeEventListener("unload", wipeSavedPosition);
    });
};

function savePositionIn(textarea: HTMLTextAreaElement): void {
    Storage.set_session(CONFIG.KEY.caret_position, textarea.selectionEnd);
}

function placeCaretIn(textarea: HTMLTextAreaElement, cursorPosition: number): void {
    textarea.setSelectionRange(cursorPosition, cursorPosition);
}

function isNaturalNumber(x: number): boolean {
    return x % 1 === 0 && x >= 0;
}
