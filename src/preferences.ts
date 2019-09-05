import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "./text";
import generalPreferences from "./preferences/general";
import darkThemePreferences from "./preferences/dark-theme";
import forumThreadsPreferences from "./preferences/forum-threads";
import editModePreferences from "./preferences/edit-mode";
import editingToolsPreferences from "./preferences/editing-tools";
import advancedPreferences from "./preferences/advanced";
import keyboardPreferences from "./preferences/keyboard";
import customizeContentPreferences from "./preferences/customize-content";
import interestsPreferences from "./preferences/interests";

export default {
    general: {
        label: T.preferences.general.label,
        _: generalPreferences,
    },
    forum_threads: {
        label: T.preferences.forum_threads.label,
        _: forumThreadsPreferences,
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
    customize_content: {
        label: T.preferences.customize_content.label,
        _: customizeContentPreferences,
    },
    keyboard: keyboardPreferences,
    interests: {
        label: T.preferences.interests.label,
        _: interestsPreferences,
    },
};
