import * as T from "../text";
import { SearchEngine } from "src/search-engines";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";

export default <const> {
    lock_heights: new BooleanPreference({
        key: "lock_heights",
        default: true,
        label: T.preferences.general.lock_heights,
        description: T.preferences.general.lock_heights_description,
    }),
    compact_layout: new BooleanPreference({
        key: "compact_layout",
        default: false,
        label: T.preferences.general.compact_layout,
        description: T.preferences.general.compact_layout_description,
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
}
