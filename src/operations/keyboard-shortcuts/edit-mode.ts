import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as Mousetrap from "mousetrap";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { Action } from "src/actions";
import { clickOn } from "src/operations/logic/click";

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
