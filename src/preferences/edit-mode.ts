import {
    BooleanPreference,
    IntegerRangePreference,
} from "ts-preferences";

import * as CONFIG from "~src/config";
import * as T from "~src/text";

const textarea_size_toggle = new BooleanPreference({
    key: "textarea_size_toggle",
    default: true,
    label: T.preferences.edit_mode.textarea_size_toggle,
    description: T.preferences.edit_mode.textarea_size_toggle_description,
    extras: { class: [ CONFIG.CLASS.inlinePreference, CONFIG.CLASS.primaryInlinePreference ] },
});

const dependencies_textarea_size_toggle = [
    {
        preference: textarea_size_toggle,
        condition: (v: boolean) => v,
    },
];

const DEFAULT_TEXTAREA_SIZE = 360;

export default {
    autosave_draft: new BooleanPreference({
        key: "autosave_draft",
        default: true,
        label: T.preferences.edit_mode.autosave_draft,
        description: T.preferences.edit_mode.autosave_draft_description,
    }),
    draft_mode_toggle: new BooleanPreference({
        key: "draft_mode_toggle",
        default: true,
        label: T.preferences.edit_mode.draft_mode_toggle,
        description: T.preferences.edit_mode.draft_mode_toggle_description,
    }),
    textarea_size: new IntegerRangePreference({
        key: "textarea_size",
        default: DEFAULT_TEXTAREA_SIZE,
        min: 0, max: Number.MAX_VALUE,
        label: T.preferences.NO_LABEL,
        extras: { implicit: true },
    }),
    textarea_size_toggle,
    textarea_size_small: new IntegerRangePreference({
        key: "textarea_size_small",
        default: 250,
        min: 50, max: 2000,
        label: T.preferences.edit_mode.textarea_size_small,
        description: T.preferences.edit_mode.textarea_size_toggle_description,
        dependencies: dependencies_textarea_size_toggle,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    textarea_size_large: new IntegerRangePreference({
        key: "textarea_size_large",
        default: 750,
        min: 50, max: 2000,
        label: T.preferences.edit_mode.textarea_size_large,
        description: T.preferences.edit_mode.textarea_size_toggle_description,
        dependencies: dependencies_textarea_size_toggle,
        extras: { class: CONFIG.CLASS.inlinePreference, suffix: T.preferences.edit_mode.textarea_size_unit },
    }),
    monospace_font: new BooleanPreference({
        key: "monospace_font",
        default: false,
        label: T.preferences.edit_mode.monospace_font,
        description: T.preferences.edit_mode.monospace_font_description,
        extras: { class: [ CONFIG.CLASS.inlinePreference, CONFIG.CLASS.primaryInlinePreference ] },
    }),
    monospace_font_in_quick_reply_form: new BooleanPreference({
        key: "monospace_font_in_quick_reply_form",
        default: false,
        label: T.preferences.in_quick_reply_form,
        description: T.preferences.in_quick_reply_form_description,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    improved_builtin_editing_tools: new BooleanPreference({
        key: "improved_builtin_editing_tools",
        default: true,
        label: T.preferences.edit_mode.improved_builtin_editing_tools,
        description: T.preferences.edit_mode.improved_builtin_editing_tools_description,
    }),
    insert_heading_toolbar_button: new BooleanPreference({
        key: "insert_heading_toolbar_button",
        default: true,
        label: T.preferences.edit_mode.insert_heading_toolbar_button,
        description: T.preferences.edit_mode.insert_heading_toolbar_button_description,
    }),
    insert_table_toolbar_button: new BooleanPreference({
        key: "insert_table_toolbar_button",
        default: true,
        label: T.preferences.edit_mode.insert_table_toolbar_button,
        description: T.preferences.edit_mode.insert_table_toolbar_button_description,
    }),
    keyboard_shortcuts: new BooleanPreference({
        key: "keyboard_shortcuts",
        default: false,
        label: T.preferences.edit_mode.keyboard_shortcuts,
        description: T.preferences.edit_mode.keyboard_shortcuts_description,
        extras: { class: [ CONFIG.CLASS.inlinePreference, CONFIG.CLASS.primaryInlinePreference ] },
    }),
    keyboard_shortcuts_in_quick_reply: new BooleanPreference({
        key: "keyboard_shortcuts_in_quick_reply",
        default: false,
        label: T.preferences.in_quick_reply_form,
        description: T.preferences.in_quick_reply_form_description,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    remember_caret_position: new BooleanPreference({
        key: "remember_caret_position",
        default: true,
        label: T.preferences.edit_mode.remember_caret_position,
        description: T.preferences.edit_mode.remember_caret_position_description,
    }),
    remove_mobile_site_disclaimer: new BooleanPreference({
        key: "remove_mobile_site_disclaimer",
        default: true,
        label: T.preferences.edit_mode.remove_mobile_site_disclaimer,
        description: T.preferences.edit_mode.remove_mobile_site_disclaimer_description,
    }),
} as const;
