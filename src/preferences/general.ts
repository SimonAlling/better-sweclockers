import * as T from "../text";
import { SearchEngine } from "src/search-engines";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";

export default {
    lock_heights: new BooleanPreference({
        key: "lock_heights",
        default: true,
        label: T.preferences.general.lock_heights,
    }),
    compact_layout: new BooleanPreference({
        key: "compact_layout",
        default: true,
        label: T.preferences.general.compact_layout,
    }),
    improved_corrections: new BooleanPreference({
        key: "improved_corrections",
        default: true,
        label: T.preferences.general.improved_corrections,
    }),
    insert_preferences_shortcut: new BooleanPreference({
        key: "insert_preferences_shortcut",
        default: true,
        label: T.preferences.general.insert_preferences_shortcut,
    }),
    replace_followed_threads_link: new BooleanPreference({
        key: "replace_followed_threads_link",
        default: false,
        label: T.preferences.general.replace_followed_threads_link,
    }),
    insert_web_search_button: new BooleanPreference({
        key: "insert_web_search_button",
        default: true,
        label: T.preferences.general.insert_web_search_button,
    }),
    search_engine: new MultichoicePreference({
        key: "search_engine",
        default: SearchEngine.GOOGLE,
        label: T.preferences.general.search_engine.label,
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
