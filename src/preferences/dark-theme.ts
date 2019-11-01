import * as ms from "milliseconds";
import {
    BooleanPreference,
    IntegerRangePreference,
    MultichoicePreference,
} from "ts-preferences";

import { Source } from "src/dark-theme";
import * as CONFIG from "src/globals-config";
import * as T from "src/text";

import { TimePreference } from "./TimePreference";

const auto = new BooleanPreference({
    key: "dark_theme_auto",
    default: true,
    label: T.preferences.dark_theme.auto,
    description: T.preferences.dark_theme.auto_description,
    extras: { class: [ CONFIG.CLASS.inlinePreference, CONFIG.CLASS.primaryInlinePreference ] },
});

const dependencies_auto = [
    {
        preference: auto,
        condition: (v: boolean) => v,
    },
] as const;

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
    source: new MultichoicePreference<Source>({
        key: "dark_theme_source",
        default: Source.BLARGMODE,
        options: [
            {
                value: Source.BLARGMODE,
                label: T.preferences.dark_theme.source.option(Source.BLARGMODE),
            },
            {
                value: Source.SOITORA,
                label: T.preferences.dark_theme.source.option(Source.SOITORA),
            },
        ],
        label: T.preferences.dark_theme.source.label,
        description: T.preferences.dark_theme.source.description,
    }),
    show_toggle: new BooleanPreference({
        key: "dark_theme_show_toggle",
        default: true,
        label: T.preferences.dark_theme.show_toggle,
        description: T.preferences.dark_theme.show_toggle_description,
    }),
    auto,
    time_on: new TimePreference({
        key: "dark_theme_time_on",
        default: ms.hours(21),
        label: T.preferences.dark_theme.between,
        description: T.preferences.dark_theme.auto_description,
        min: 0,
        max: ms.days(1),
        dependencies: dependencies_auto,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    time_off: new TimePreference({
        key: "dark_theme_time_off",
        default: ms.hours(7),
        label: T.preferences.dark_theme.and,
        description: T.preferences.dark_theme.auto_description,
        min: 0,
        max: ms.days(1),
        dependencies: dependencies_auto,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    interval: new IntegerRangePreference({
        key: "dark_theme_interval",
        default: 10,
        label: T.preferences.dark_theme.interval,
        description: T.preferences.dark_theme.interval_description,
        min: 1,
        max: 600,
        extras: { suffix: T.general.seconds },
    }),
    use_backup: new BooleanPreference({
        key: "dark_theme_use_backup",
        default: true,
        label: T.preferences.dark_theme.use_backup,
        description: T.preferences.dark_theme.use_backup_description,
    }),
} as const;
