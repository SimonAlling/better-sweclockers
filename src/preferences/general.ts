import * as T from "../text";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";

export const enum SearchEngine {
    // Be careful! This mapping to URLs IS meaningful.
    GOOGLE = "https://google.com/search?q=",
    DUCKDUCKGO = "https://duckduckgo.com/?q=",
}

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
    search_engine: new MultichoicePreference({
        key: "search_engine",
        default: SearchEngine.GOOGLE,
        label: T.preferences.general.search_engine.label,
        options: [
            {
                value: SearchEngine.GOOGLE,
                label: T.preferences.general.search_engine.google,
            },
            {
                value: SearchEngine.DUCKDUCKGO,
                label: T.preferences.general.search_engine.duckduckgo,
            },
        ],
    }),
}
