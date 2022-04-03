import * as Mousetrap from "mousetrap";

import { Action } from "~src/actions";
import { clickOn } from "~src/operations/logic/click";
import { P, Preferences } from "~src/preferences";
import * as SITE from "~src/site";

import { insertIn, wrap_tag } from "../logic/textarea";

const keyboardShortcuts = Preferences.get(P.keyboard);

export function submit(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
}) {
    bindKeyboardShortcut(
        Action.SUBMIT,
        _ => clickOn(e.saveButton),
        { preventDefault: true },
    );
}

export function preview(e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) {
    bindKeyboardShortcut(
        Action.PREVIEW,
        _ => clickOn(e.previewButton),
        { preventDefault: true },
    );
}

export const insertUrl = (undoSupport: boolean) => (e: {
    textarea: HTMLElement,
}) => {
    bindKeyboardShortcut(
        Action.INSERT_URL,
        _ => wrap_tag({ tag: SITE.TAG.url, parameterized: true, block: false })(e.textarea as HTMLTextAreaElement, undoSupport),
        { preventDefault: true },
    );
};

export const insertTab = (content: string, undoSupport: boolean) => (e: {
    textarea: HTMLElement,
}) => {
    bindKeyboardShortcut(
        Action.INSERT_TAB,
        event => {
            if (document.activeElement === e.textarea) {
                event.preventDefault();
                insertIn(e.textarea as HTMLTextAreaElement, { string: content, replace: undoSupport });
            }
        },
        { preventDefault: false },
    );
};

function bindKeyboardShortcut(
    action: Action,
    handler: (event: Event) => void,
    options: {
        preventDefault: boolean,
    },
) {
    for (const entry of keyboardShortcuts) {
        if (entry.action === action) {
            Mousetrap.bind(entry.shortcut, event => {
                if (options.preventDefault) {
                    event.preventDefault();
                }
                handler(event);
            });
        }
    }
}
