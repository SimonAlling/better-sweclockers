import * as CONFIG from "globals-config";
import * as T from "src/text";
import {
    BooleanPreference,
} from "ts-preferences";

export default {
    improved_pagination_buttons: new BooleanPreference({
        key: "improved_pagination_buttons",
        default: true,
        label: T.preferences.forum_threads.improved_pagination_buttons,
    }),
    highlight_own_posts: new BooleanPreference({
        key: "highlight_own_posts",
        default: true,
        label: T.preferences.forum_threads.highlight_own_posts,
    }),
    insert_pm_links: new BooleanPreference({
        key: "insert_pm_links",
        default: true,
        label: T.preferences.forum_threads.insert_pm_links,
    }),
}
