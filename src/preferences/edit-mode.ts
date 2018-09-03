import * as T from "../text";
import {
    BooleanPreference,
} from "ts-preferences";

export default {
    place_caret_at_end: new BooleanPreference({
        key: "place_caret_at_end",
        default: true,
        label: T.preferences.edit_mode.place_caret_at_end,
    }),
    remember_caret_position: new BooleanPreference({
        key: "remember_caret_position",
        default: true,
        label: T.preferences.edit_mode.remember_caret_position,
    }),
    remove_mobile_site_disclaimer: new BooleanPreference({
        key: "remove_mobile_site_disclaimer",
        default: true,
        label: T.preferences.edit_mode.remove_mobile_site_disclaimer,
    }),
}
