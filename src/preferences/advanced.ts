import {
    BooleanPreference,
    MultichoicePreference,
    StringPreference,
} from "ts-preferences";

import * as CONFIG from "~src/globals-config";
import * as Proofreading from "~src/operations/proofreading";
import * as T from "~src/text";

const custom_css_enable = new BooleanPreference({
    key: "custom_css_enable",
    default: false,
    label: T.preferences.advanced.custom_css_enable,
    description: T.preferences.advanced.custom_css_enable_description,
});

export default {
    prevent_accidental_signout: new BooleanPreference({
        key: "prevent_accidental_signout",
        default: true,
        label: T.preferences.advanced.prevent_accidental_signout,
        description: T.preferences.advanced.prevent_accidental_signout_description,
    }),
    prevent_accidental_unload: new BooleanPreference({
        key: "prevent_accidental_unload",
        default: true,
        label: T.preferences.advanced.prevent_accidental_unload,
        description: T.preferences.advanced.prevent_accidental_unload_description,
    }),
    improved_image_controls: new BooleanPreference({
        key: "improved_image_controls",
        default: true,
        label: T.preferences.advanced.improved_image_controls,
        description: T.preferences.advanced.improved_image_controls_description,
    }),
    disable_scroll_restoration: new BooleanPreference({
        key: "disable_scroll_restoration",
        default: false,
        label: T.preferences.advanced.disable_scroll_restoration,
        description: T.preferences.advanced.disable_scroll_restoration_description,
    }),
    down_for_maintenance: new BooleanPreference({
        key: "down_for_maintenance",
        default: false,
        label: T.preferences.advanced.down_for_maintenance,
        description: T.preferences.advanced.down_for_maintenance_description,
    }),
    proofread_articles: new MultichoicePreference({
        key: "proofread_articles",
        default: Proofreading.Options.NEVER,
        label: T.preferences.advanced.proofread_articles.label,
        description: T.preferences.advanced.proofread_articles.description,
        options: [
            {
                value: Proofreading.Options.ALWAYS,
                label: T.preferences.advanced.proofread_articles.always,
            },
            {
                value: Proofreading.Options.CORRECTIONS,
                label: T.preferences.advanced.proofread_articles.corrections,
            },
            {
                value: Proofreading.Options.NEVER,
                label: T.preferences.advanced.proofread_articles.never,
            },
        ],
    }),
    proofread_forum_posts: new BooleanPreference({
        key: "proofread_forum_posts",
        default: false,
        label: T.preferences.advanced.proofread_forum_posts,
        description: T.preferences.advanced.proofread_forum_posts_description,
    }),
    custom_css_enable,
    custom_css_code: new StringPreference({
        key: "custom_css_code",
        default: "",
        label: T.preferences.NO_LABEL,
        description: T.preferences.advanced.custom_css_enable_description,
        multiline: true,
        extras: { class: CONFIG.CLASS.codeInput },
        dependencies: [
            {
                preference: custom_css_enable,
                condition: (v: boolean) => v,
            },
        ],
    }),
} as const;
