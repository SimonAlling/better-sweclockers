import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "./text";
import {
    BooleanPreference,
} from "ts-preferences";
import generalPreferences from "./preferences/general";
import darkThemePreferences from "./preferences/dark-theme";
import editModePreferences from "./preferences/edit-mode";
import editingToolsPreferences from "./preferences/editing-tools";
import advancedPreferences from "./preferences/advanced";

export default {
    general: {
        label: T.preferences.general.label,
        _: generalPreferences,
    },
    edit_mode: {
        label: T.preferences.edit_mode.label,
        _: editModePreferences,
    },
    editing_tools: {
        label: T.preferences.editing_tools.label,
        _: editingToolsPreferences,
        extras: { id: CONFIG.ID.editingToolsPreferences },
    },
    dark_theme: {
        label: T.preferences.dark_theme.label,
        _: darkThemePreferences,
    },
    advanced: {
        label: T.preferences.advanced.label,
        _: advancedPreferences,
    },
};
