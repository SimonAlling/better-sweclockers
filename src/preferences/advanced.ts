import * as T from "../text";
import {
    BooleanPreference,
} from "ts-preferences";

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
    hide_image_controls: new BooleanPreference({
        key: "hide_image_controls",
        default: true,
        label: T.preferences.advanced.hide_image_controls,
    }),
    hide_carousel: new BooleanPreference({
        key: "hide_carousel",
        default: false,
        label: T.preferences.advanced.hide_carousel,
    }),
    hide_social_media: new BooleanPreference({
        key: "hide_social_media",
        default: true,
        label: T.preferences.advanced.hide_social_media,
    }),
    disable_scroll_restoration: new BooleanPreference({
        key: "disable_scroll_restoration",
        default: false,
        label: T.preferences.advanced.disable_scroll_restoration,
    }),
}
