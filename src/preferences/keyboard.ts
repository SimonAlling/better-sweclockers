import * as T from "../text";
import {
    ListPreference,
} from "ts-preferences";
import { Action } from "src/actions";

export type ShortcutEntry = {
    readonly shortcut: string
    readonly action: Action
}

export default new ListPreference<ShortcutEntry>({
    key: "keyboard",
    label: T.preferences.NO_LABEL,
    default: [
        { shortcut: "mod+s", action: Action.PREVIEW },
    ],
    extras: { implicit: true },
});
