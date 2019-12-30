import * as Mousetrap from "mousetrap";

import { Action } from "~src/actions";
import { clickOn } from "~src/operations/logic/click";
import { P, Preferences } from "~src/preferences";

const keyboardShortcuts = Preferences.get(P.keyboard);

export function submit(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
}) {
    for (const entry of keyboardShortcuts) {
        if (entry.action === Action.SUBMIT) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.saveButton);
            });
        }
    }
}

export function preview(e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) {
    for (const entry of keyboardShortcuts) {
        if (entry.action === Action.PREVIEW) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                clickOn(e.previewButton);
            });
        }
    }
}
