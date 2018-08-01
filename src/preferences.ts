import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "./text";
import {
    BooleanPreference,
} from "ts-preferences";
import generalPreferences from "./preferences/general";
import darkThemePreferences from "./preferences/dark-theme";
import editingToolsPreferences from "./preferences/editing-tools";

export default {
    general: {
        label: T.preferences.general.label,
        _: generalPreferences,
    },
    editing_tools: {
        label: T.preferences.editing_tools.label,
        _: editingToolsPreferences,
    },
    dark_theme: {
        label: T.preferences.dark_theme.label,
        _: darkThemePreferences,
    },
};
