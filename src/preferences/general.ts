import {
    BooleanPreference,
    IntegerPreference,
    MultichoicePreference,
    StringPreference,
} from "ts-preferences";

import { SearchEngine } from "~src/search-engines";
import * as T from "~src/text";

export default {
    lock_heights: new BooleanPreference({
        key: "lock_heights",
        default: true,
        label: T.preferences.general.lock_heights,
        description: T.preferences.general.lock_heights_description,
    }),
    fixed_avatar_size: new BooleanPreference({
        key: "fixed_avatar_size",
        default: true,
        label: T.preferences.general.fixed_avatar_size,
        description: T.preferences.general.fixed_avatar_size_description,
    }),
    adaptive_width: new BooleanPreference({
        key: "adaptive_width",
        default: false,
        label: T.preferences.general.adaptive_width,
        description: T.preferences.general.adaptive_width_description,
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
    thread_status_tooltips: new BooleanPreference({
        key: "thread_status_tooltips",
        default: true,
        label: T.preferences.general.thread_status_tooltips,
        description: T.preferences.general.thread_status_tooltips_description,
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
        label: T.preferences.NO_LABEL,
        extras: { implicit: true },
    }),
    location_city: new StringPreference({
        key: "location_city",
        default: "",
        label: T.preferences.NO_LABEL,
        multiline: false,
        extras: { implicit: true },
    }),
    insert_web_search_button: new BooleanPreference({
        key: "insert_web_search_button",
        default: true,
        label: T.preferences.general.insert_web_search_button,
        description: T.preferences.general.insert_web_search_button_description,
    }),
    search_engine: new MultichoicePreference({
        key: "search_engine",
        default: SearchEngine.GOOGLE,
        label: T.preferences.general.search_engine.label,
        description: T.preferences.general.search_engine.description,
        options: [
            {
                value: SearchEngine.GOOGLE,
                label: SearchEngine.GOOGLE,
            },
            {
                value: SearchEngine.DUCKDUCKGO,
                label: SearchEngine.DUCKDUCKGO,
            },
        ],
    }),
} as const;
