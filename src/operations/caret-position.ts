import * as Storage from "ts-storage";

import { isPositiveInt } from ".userscripter/lib/utilities";

import * as CONFIG from "src/globals-config";
import P from "src/preferences";
import { Preferences } from "src/userscripter/preference-handling";

export default (e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) => {
    // Caret position is only saved when the user requests a preview; it is
    // wiped on any other page unload.
    const textarea = e.textarea as HTMLTextAreaElement;
    const savedPosition = Storage.get_session(CONFIG.KEY.caret_position, NaN).value;
    // The check below is done here instead of as a condition for the entire
    // operation, because we need the wiping to be done even if the user has
    // disabled remember_caret_position.
    if (Preferences.get(P.edit_mode._.remember_caret_position) && isPositiveInt(savedPosition)) {
        placeCaretIn(textarea, savedPosition);
    }
    const wipeSavedPosition = () => Storage.remove_session(CONFIG.KEY.caret_position);
    window.addEventListener("unload", wipeSavedPosition);
    e.previewButton.addEventListener("click", () => {
        savePositionIn(textarea);
        window.removeEventListener("unload", wipeSavedPosition);
    });
}

function savePositionIn(textarea: HTMLTextAreaElement): void {
    Storage.set_session(CONFIG.KEY.caret_position, textarea.selectionEnd);
}

function placeCaretIn(textarea: HTMLTextAreaElement, cursorPosition: number): void {
    textarea.setSelectionRange(cursorPosition, cursorPosition);
}
