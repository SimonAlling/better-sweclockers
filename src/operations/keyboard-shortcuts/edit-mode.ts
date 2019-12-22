import * as Mousetrap from "mousetrap";

import { Action } from "~src/actions";
import { clickOn } from "~src/operations/logic/click";
import P from "~src/preferences";
import { Preferences } from "~src/userscripter/preference-handling";

const keyboardShortcuts = Preferences.get(P.keyboard);

export function submit(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
}) {
    keyboardShortcuts.forEach(entry => {
        if (entry.action === Action.SUBMIT) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.saveButton);
            });
        }
    });
}

export function preview(e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) {
    keyboardShortcuts.forEach(entry => {
        if (entry.action === Action.PREVIEW) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.previewButton);
            });
        }
    });
}
