import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    StringPreference,
    MultichoicePreference,
} from "ts-preferences";
import * as Proofreading from "../operations/proofreading";

const custom_css_enable = new BooleanPreference({
    key: "custom_css_enable",
    default: false,
    label: T.preferences.advanced.custom_css_enable,
});

export default {
    prevent_accidental_signout: new BooleanPreference({
        key: "prevent_accidental_signout",
        default: true,
        label: T.preferences.advanced.prevent_accidental_signout,
    }),
    prevent_accidental_unload: new BooleanPreference({
        key: "prevent_accidental_unload",
        default: true,
        label: T.preferences.advanced.prevent_accidental_unload,
    }),
    improved_image_controls: new BooleanPreference({
        key: "improved_image_controls",
        default: true,
        label: T.preferences.advanced.improved_image_controls,
    }),
    disable_scroll_restoration: new BooleanPreference({
        key: "disable_scroll_restoration",
        default: false,
        label: T.preferences.advanced.disable_scroll_restoration,
    }),
    down_for_maintenance: new BooleanPreference({
        key: "down_for_maintenance",
        default: false,
        label: T.preferences.advanced.down_for_maintenance,
    }),
    proofread_articles: new MultichoicePreference({
        key: "proofread_articles",
        default: Proofreading.Options.NEVER,
        label: T.preferences.advanced.proofread_articles.label,
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
    }),
    custom_css_enable,
    custom_css_code: new StringPreference({
        key: "custom_css_code",
        default: "",
        label: T.preferences.NO_LABEL,
        multiline: true,
        extras: { class: CONFIG.CLASS.codeInput },
        dependencies: [
            {
                preference: custom_css_enable,
                condition: (v: boolean) => v,
            },
        ],
    }),
}
