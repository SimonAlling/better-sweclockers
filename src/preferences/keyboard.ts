import { ListPreference } from "ts-preferences";

import { Action } from "~src/actions";
import * as T from "~src/text";

export type ShortcutEntry = Readonly<{
    shortcut: string,
    action: Action,
}>

export default new ListPreference<ShortcutEntry>({
    key: "keyboard",
    label: T.preferences._.NO_LABEL,
    default: [
        { shortcut: "mod+s", action: Action.SUBMIT },
        { shortcut: "mod+p", action: Action.PREVIEW },
        { shortcut: "tab", action: Action.INSERT_TAB },
    ],
    extras: { implicit: true },
});
