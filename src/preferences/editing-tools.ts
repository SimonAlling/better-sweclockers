import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";
import { render } from "preact";
import { Button, BUTTONS, insertButton } from "../operations/editing-tools";
import { SearchEngine } from "search-engines";

function buttonsDescription(buttons: ReadonlyArray<Button>): string {
    const textarea = document.createElement("textarea");
    const connectedButtons = buttons.map(b => b(textarea));
    const div = document.createElement("div");
    connectedButtons.forEach(b => {
        render(b, div);
    });
    return div.innerHTML;
}

const enable = new BooleanPreference({
    key: "editing_tools",
    default: true,
    label: T.preferences.editing_tools.enable,
    description: T.preferences.editing_tools.enable_description,
    extras: { class: [ CONFIG.CLASS.inlinePreference, CONFIG.CLASS.primaryInlinePreference ] },
});

const dependencies = [ {
    preference: enable,
    condition: (v: boolean) => v,
} ];

export const enum Position {
    ABOVE = "above", BELOW = "below",
}

export default <const> {
    enable,
    in_quick_reply_form: new BooleanPreference({
        key: "editing_tools_in_quick_reply_form",
        default: true,
        label: T.preferences.in_quick_reply_form,
        description: T.preferences.in_quick_reply_form_description,
        extras: { class: CONFIG.CLASS.inlinePreference },
    }),
    position: new MultichoicePreference({
        key: "editing_tools_position",
        default: Position.BELOW,
        label: T.preferences.editing_tools.position.label,
        description: T.preferences.editing_tools.position.description,
        options: [
            {
                value: Position.ABOVE,
                label: T.preferences.editing_tools.position.above,
            },
            {
                value: Position.BELOW,
                label: T.preferences.editing_tools.position.below,
            },
        ],
        dependencies,
    }),
    special_characters: new BooleanPreference({
        key: "editing_tools_special_characters",
        default: true,
        label: T.preferences.editing_tools.special_characters,
        extras: {
            more: buttonsDescription(T.special_characters.slice(0, 5).map(insertButton)) + "…",
            class: CONFIG.CLASS.editingTools,
        },
        dependencies,
    }),
    code: new BooleanPreference({
        key: "editing_tools_code",
        default: true,
        label: T.preferences.editing_tools.code,
        extras: {
            more: buttonsDescription(BUTTONS.code),
            class: CONFIG.CLASS.editingTools,
        },
        dependencies,
    }),
    math: new BooleanPreference({
        key: "editing_tools_math",
        default: true,
        label: T.preferences.editing_tools.math,
        extras: {
            more: buttonsDescription(BUTTONS.math),
            class: CONFIG.CLASS.editingTools,
        },
        dependencies,
    }),
    whitespace: new BooleanPreference({
        key: "editing_tools_whitespace",
        default: true,
        label: T.preferences.editing_tools.whitespace,
        extras: {
            more: buttonsDescription(BUTTONS.whitespace),
            class: CONFIG.CLASS.editingTools,
        },
        dependencies,
    }),
    embed: new BooleanPreference({
        key: "editing_tools_embed",
        default: true,
        label: T.preferences.editing_tools.embed,
        extras: {
            more: buttonsDescription(BUTTONS.embed(SearchEngine.GOOGLE)),
            class: CONFIG.CLASS.editingTools,
        },
        dependencies,
    }),
    doge: new BooleanPreference({
        key: "editing_tools_doge",
        default: false,
        label: T.preferences.editing_tools.doge,
        extras: {
            more: T.preferences.editing_tools.doge_description,
            class: [ CONFIG.CLASS.shibe, CONFIG.CLASS.editingTools ].join(" "),
        },
        dependencies,
    }),
    color_palette: new BooleanPreference({
        key: "editing_tools_color_palette",
        default: true,
        label: T.preferences.editing_tools.color_palette,
        description: T.preferences.editing_tools.color_palette_description,
        extras: { class: CONFIG.CLASS.editingTools },
        dependencies,
    }),
}
