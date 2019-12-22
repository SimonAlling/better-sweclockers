import * as CONFIG from "~src/globals-config";
import * as T from "~src/text";

import advancedPreferences from "./preferences/advanced";
import customizeContentPreferences from "./preferences/customize-content";
import darkThemePreferences from "./preferences/dark-theme";
import editModePreferences from "./preferences/edit-mode";
import editingToolsPreferences from "./preferences/editing-tools";
import forumThreadsPreferences from "./preferences/forum-threads";
import generalPreferences from "./preferences/general";
import interestsPreferences from "./preferences/interests";
import keyboardPreferences from "./preferences/keyboard";

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
} as const;
