import * as CONFIG from "globals-config";
import * as T from "src/text";
import {
    BooleanPreference,
    StringPreference,
} from "ts-preferences";

const quote_signature_buttons = new BooleanPreference({
    key: "quote_signature_buttons",
    default: true,
    label: T.preferences.forum_threads.quote_signature_buttons,
});

const dependencies_quote_signature = [ {
    preference: quote_signature_buttons,
    condition: (v: boolean) => v,
} ];

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
    insert_link_to_top: new BooleanPreference({
        key: "insert_link_to_top",
        default: true,
        label: T.preferences.forum_threads.insert_link_to_top,
    }),
    insert_pm_links: new BooleanPreference({
        key: "insert_pm_links",
        default: true,
        label: T.preferences.forum_threads.insert_pm_links,
    }),
    fix_mobile_links: new BooleanPreference({
        key: "fix_mobile_links",
        default: true,
        label: T.preferences.forum_threads.fix_mobile_links,
    }),
    quote_signature_buttons,
    quote_signature_message: new StringPreference({
        key: "quote_signature_message",
        default: T.preferences.forum_threads.quote_signature_message_default,
        label: T.preferences.forum_threads.quote_signature_message,
        multiline: true,
        dependencies: dependencies_quote_signature,
    }),
}
