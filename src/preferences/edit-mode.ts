import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    IntegerRangePreference,
} from "ts-preferences";

const textarea_size_toggle = new BooleanPreference({
    key: "textarea_size_toggle",
    default: true,
    label: T.preferences.edit_mode.textarea_size_toggle,
    extras: { class: CONFIG.CLASS.inlinePreference },
});

const dependencies_textarea_size_toggle = [
    {
        preference: textarea_size_toggle,
        condition: (v: boolean) => v,
    },
];

const DEFAULT_TEXTAREA_SIZE = 360;

export default {
    textarea_size: new IntegerRangePreference({
        key: "textarea_size",
        default: DEFAULT_TEXTAREA_SIZE,
        min: 0, max: Infinity,
        infinite: true,
        label: T.preferences.NO_LABEL,
        extras: { implicit: true },
    }),
    textarea_size_toggle,
    textarea_size_small: new IntegerRangePreference({
        key: "textarea_size_small",
        default: 250,
        min: 50, max: 2000,
        label: T.preferences.edit_mode.textarea_size_small,
        dependencies: dependencies_textarea_size_toggle,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    textarea_size_large: new IntegerRangePreference({
        key: "textarea_size_large",
        default: 750,
        min: 50, max: 2000,
        label: T.preferences.edit_mode.textarea_size_large,
        dependencies: dependencies_textarea_size_toggle,
        extras: { class: CONFIG.CLASS.inlinePreference, suffix: T.preferences.edit_mode.textarea_size_unit },
    }),
    place_caret_at_end: new BooleanPreference({
        key: "place_caret_at_end",
        default: true,
        label: T.preferences.edit_mode.place_caret_at_end,
    }),
    remember_caret_position: new BooleanPreference({
        key: "remember_caret_position",
        default: true,
        label: T.preferences.edit_mode.remember_caret_position,
    }),
    remove_mobile_site_disclaimer: new BooleanPreference({
        key: "remove_mobile_site_disclaimer",
        default: true,
        label: T.preferences.edit_mode.remove_mobile_site_disclaimer,
    }),
}