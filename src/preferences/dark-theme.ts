import * as CONFIG from "globals-config";
import * as T from "../text";
import * as ms from "milliseconds";
import {
    BooleanPreference,
} from "ts-preferences";
import { TimePreference } from "./TimePreference";

const auto = new BooleanPreference({
    key: "dark_theme_auto",
    default: true,
    label: T.preferences.dark_theme.auto,
    extras: { class: CONFIG.CLASS.inlinePreference },
});

const dependencies_auto = [
    {
        preference: auto,
        condition: (v: boolean) => v,
    },
];

export default {
    active: new BooleanPreference({
        key: "dark_theme_active",
        default: false,
        label: T.preferences.NO_LABEL,
        extras: { implicit: true },
    }),
    last_autoset_state: new BooleanPreference({
        key: "dark_theme_last_autoset_state",
        default: false,
        label: T.preferences.NO_LABEL,
        extras: { implicit: true },
    }),
    show_toggle: new BooleanPreference({
        key: "dark_theme_show_toggle",
        default: true,
        label: T.preferences.dark_theme.show_toggle,
    }),
    auto,
    time_on: new TimePreference({
        key: "dark_theme_time_on",
        default: CONFIG.DARK_THEME.enableAt,
        label: T.preferences.dark_theme.between,
        min: 0,
        max: ms.days(1),
        dependencies: dependencies_auto,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    time_off: new TimePreference({
        key: "dark_theme_time_off",
        default: CONFIG.DARK_THEME.disableAt,
        label: T.preferences.dark_theme.and,
        min: 0,
        max: ms.days(1),
        dependencies: dependencies_auto,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
}
