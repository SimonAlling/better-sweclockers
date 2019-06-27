import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as Mousetrap from "mousetrap";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { Action } from "src/actions";
import { BUTTON_CLICK_EVENT } from "src/operations/prevent-accidental-unload";

export default (e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
    saveButton: HTMLElement,
}) => {
    Preferences.get(P.keyboard).forEach(entry => {
        if (entry.action === Action.PREVIEW) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.previewButton);
            });
        } else if (entry.action === Action.SUBMIT) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.saveButton);
            });
        }
    });
}

function clickOn(element: HTMLElement): void {
    // Prevent accidental unload listens for these events:
    element.dispatchEvent(new Event(BUTTON_CLICK_EVENT));
    // click() is necessary for the button to be triggered; dispatching
    // mousedown and then mouseup is not.
    element.click();
}
