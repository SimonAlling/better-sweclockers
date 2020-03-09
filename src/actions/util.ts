import * as Mousetrap from "mousetrap";

import { P, Preferences } from "~src/preferences";
import { ShortcutEntry } from "~src/preferences/keyboard";

import { Action } from "./action";

const keyboardShortcuts = Preferences.get(P.keyboard);

export function addEditModeKeyboardShortcut(action: Action): string {
    return `"add edit mode keyboard shortcut (${action})`;
}

export function bind(action: Action, condition: () => boolean, f: () => void): void {
    for (const entry of keyboardShortcuts) {
        if (entry.action === action) {
            bindShortcut(entry, condition, f);
        }
    }
}

export function bindShortcut(entry: ShortcutEntry, condition: () => boolean, f: () => void): void {
    Mousetrap.bind(entry.shortcut, event => {
        if (condition()) {
            event.preventDefault();
            f();
        }
    });
}

export function isFocused(element: HTMLElement): () => boolean {
    return () => element.matches(":focus");
}
