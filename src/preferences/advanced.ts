import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    StringPreference,
} from "ts-preferences";

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
