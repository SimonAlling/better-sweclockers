import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";
import { h, render } from "preact";
import { Button, BUTTONS } from "../operations/editing-tools";

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
});

const dependencies = [ {
    preference: enable,
    condition: (v: boolean) => v,
} ];

export const enum Position {
    ABOVE = "above", BELOW = "below",
}

export default {
    enable,
    position: new MultichoicePreference({
        key: "editing_tools_position",
        default: Position.BELOW,
        label: T.preferences.editing_tools.position.label,
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
        extras: { class: CONFIG.CLASS.editingTools },
        dependencies,
    }),
    code: new BooleanPreference({
        key: "editing_tools_code",
        default: true,
        label: T.preferences.editing_tools.code,
        description: buttonsDescription(BUTTONS.code),
        extras: { class: CONFIG.CLASS.editingTools },
        dependencies,
    }),
    math: new BooleanPreference({
        key: "editing_tools_math",
        default: true,
        label: T.preferences.editing_tools.math,
        description: buttonsDescription(BUTTONS.math),
        extras: { class: CONFIG.CLASS.editingTools },
        dependencies,
    }),
    embed: new BooleanPreference({
        key: "editing_tools_embed",
        default: true,
        label: T.preferences.editing_tools.embed,
        description: buttonsDescription(BUTTONS.embed("")),
        extras: { class: CONFIG.CLASS.editingTools },
        dependencies,
    }),
    doge: new BooleanPreference({
        key: "editing_tools_doge",
        default: false,
        label: T.preferences.editing_tools.doge,
        description: buttonsDescription(BUTTONS.doge),
        extras: { class: [ CONFIG.CLASS.shibe, CONFIG.CLASS.editingTools ].join(" ") },
        dependencies,
    }),
}
