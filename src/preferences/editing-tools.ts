import * as CONFIG from "globals-config";
import * as T from "../text";
import {
    BooleanPreference,
    MultichoicePreference,
} from "ts-preferences";

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
        dependencies,
    }),
    code: new BooleanPreference({
        key: "editing_tools_code",
        default: true,
        label: T.preferences.editing_tools.code,
        dependencies,
    }),
    math: new BooleanPreference({
        key: "editing_tools_math",
        default: true,
        label: T.preferences.editing_tools.math,
        dependencies,
    }),
    embed: new BooleanPreference({
        key: "editing_tools_embed",
        default: true,
        label: T.preferences.editing_tools.embed,
        dependencies,
    }),
    doge: new BooleanPreference({
        key: "editing_tools_doge",
        default: false,
        label: T.preferences.editing_tools.doge,
        extras: { class: CONFIG.CLASS.shibe },
        dependencies,
    }),
}
