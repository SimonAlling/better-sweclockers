import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as Storage from "ts-storage";
import SELECTOR from "src/selectors";
import { FAILURE } from "lib/operation-manager";
import { isPositiveInt } from "lib/utilities";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";

export default (e: {
    textarea: HTMLElement
    previewButton: HTMLElement
}) => {
    // Caret position is only saved when the user requests a preview; it is
    // wiped on any other page unload.
    const textarea = e.textarea as HTMLTextAreaElement;
    const savedPosition = Storage.get_session(CONFIG.KEY.caret_position, NaN).value;
    if (Preferences.get(P.edit_mode._.remember_caret_position) && isPositiveInt(savedPosition)) {
        placeCaretIn(textarea, savedPosition);
    } else if (Preferences.get(P.edit_mode._.place_caret_at_end)) {
        placeCaretIn(textarea, textarea.value.length);
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