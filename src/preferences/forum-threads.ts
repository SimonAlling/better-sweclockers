import {
    BooleanPreference,
    StringPreference,
} from "ts-preferences";

import * as T from "~src/text";

const quote_signature_buttons = new BooleanPreference({
    key: "quote_signature_buttons",
    default: true,
    label: T.preferences.forum_threads.quote_signature_buttons,
    description: T.preferences.forum_threads.quote_signature_buttons_description,
});

const dependencies_quote_signature = [
    {
        preference: quote_signature_buttons,
        condition: (v: boolean) => v,
    },
];

export default {
    improved_pagination_buttons: new BooleanPreference({
        key: "improved_pagination_buttons",
        default: true,
        label: T.preferences.forum_threads.improved_pagination_buttons,
        description: T.preferences.forum_threads.improved_pagination_buttons_description,
    }),
    insert_link_to_top: new BooleanPreference({
        key: "insert_link_to_top",
        default: true,
        label: T.preferences.forum_threads.insert_link_to_top,
        description: T.preferences.forum_threads.insert_link_to_top_description,
    }),
    highlight_own_posts: new BooleanPreference({
        key: "highlight_own_posts",
        default: true,
        label: T.preferences.forum_threads.highlight_own_posts,
        description: T.preferences.forum_threads.highlight_own_posts_description,
    }),
    insert_pm_links: new BooleanPreference({
        key: "insert_pm_links",
        default: true,
        label: T.preferences.forum_threads.insert_pm_links,
        description: T.preferences.forum_threads.insert_pm_links_description,
    }),
    mention_everyone_button: new BooleanPreference({
        key: "mention_everyone_button",
        default: false,
        label: T.preferences.forum_threads.mention_everyone_button,
        description: T.preferences.forum_threads.mention_everyone_button_description,
    }),
    quote_signature_buttons,
    quote_signature_message: new StringPreference({
        key: "quote_signature_message",
        default: T.preferences.forum_threads.quote_signature_message_default,
        label: T.preferences.forum_threads.quote_signature_message,
        description: T.preferences.forum_threads.quote_signature_message_description,
        multiline: true,
        dependencies: dependencies_quote_signature,
    }),
} as const;
