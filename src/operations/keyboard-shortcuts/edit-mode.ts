import * as Mousetrap from "mousetrap";

import { Action } from "~src/actions";
import { clickOn } from "~src/operations/logic/click";
import { P, Preferences } from "~src/preferences";

const keyboardShortcuts = Preferences.get(P.keyboard);

export function submit(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
}) {
    bindKeyboardShortcut(Action.SUBMIT, _ => clickOn(e.saveButton));
}

export function preview(e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) {
    bindKeyboardShortcut(Action.PREVIEW, _ => clickOn(e.previewButton));
}

function bindKeyboardShortcut(action: Action, handler: (event: Event) => void) {
    for (const entry of keyboardShortcuts) {
        if (entry.action === action) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                handler(event);
            });
        }
    }
}
