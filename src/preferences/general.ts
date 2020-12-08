import {
    BooleanPreference,
    IntegerPreference,
    StringPreference,
} from "ts-preferences";

import * as T from "~src/text";

export default {
    lock_heights: new BooleanPreference({
        key: "lock_heights",
        default: true,
        label: T.preferences.general.lock_heights,
        description: T.preferences.general.lock_heights_description,
    }),
    improved_corrections: new BooleanPreference({
        key: "improved_corrections",
        default: true,
        label: T.preferences.general.improved_corrections,
        description: T.preferences.general.improved_corrections_description,
    }),
    insert_preferences_shortcut: new BooleanPreference({
        key: "insert_preferences_shortcut",
        default: true,
        label: T.preferences.general.insert_preferences_shortcut,
        description: T.preferences.general.insert_preferences_shortcut_description,
    }),
    replace_followed_threads_link: new BooleanPreference({
        key: "replace_followed_threads_link",
        default: false,
        label: T.preferences.general.replace_followed_threads_link,
        description: T.preferences.general.replace_followed_threads_link_description,
    }),
    remember_location_in_market: new BooleanPreference({
        key: "remember_location_in_market",
        default: true,
        label: T.preferences.general.remember_location_in_market,
        description: T.preferences.general.remember_location_in_market_description,
    }),
    location_region: new IntegerPreference({
        key: "location_region",
        default: 0, // "Välj region:"
        label: T.preferences._.NO_LABEL,
        extras: { implicit: true },
    }),
    location_city: new StringPreference({
        key: "location_city",
        default: "",
        label: T.preferences._.NO_LABEL,
        multiline: false,
        extras: { implicit: true },
    }),
} as const;
