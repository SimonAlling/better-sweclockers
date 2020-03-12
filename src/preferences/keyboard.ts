import { ListPreference } from "ts-preferences";

import { Action } from "~src/actions/action";
import * as T from "~src/text";

export type ShortcutEntry = Readonly<{
    shortcut: string,
    action: Action,
}>

export default new ListPreference<ShortcutEntry>({
    key: "keyboard",
    label: T.preferences.NO_LABEL,
    default: [
        { shortcut: "mod+s", action: Action.SUBMIT },
        { shortcut: "mod+p", action: Action.PREVIEW },
        { shortcut: "mod+h", action: Action.INSERT_HEADER },
        { shortcut: "mod+k", action: Action.INSERT_LINK },
    ],
    extras: { implicit: true },
});
