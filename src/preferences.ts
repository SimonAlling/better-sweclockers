import { PreferenceManager } from "ts-preferences";
import { loggingResponseHandler, subscriptable } from "userscripter/lib/preferences";

import * as CONFIG from "~src/config";
import * as darkTheme from "~src/dark-theme";
import * as T from "~src/text";
import U from "~src/userscript";

import advancedPreferences from "./preferences/advanced";
import customizeContentPreferences from "./preferences/customize-content";
import darkThemePreferences from "./preferences/dark-theme";
import editModePreferences from "./preferences/edit-mode";
import editingToolsPreferences from "./preferences/editing-tools";
import forumThreadsPreferences from "./preferences/forum-threads";
import generalPreferences from "./preferences/general";
import interestsPreferences from "./preferences/interests";
import keyboardPreferences from "./preferences/keyboard";

export const P = {
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
        label: T.preferences.dark_theme.label(darkTheme.AUTHOR, darkTheme.URL.info),
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

export const responseHandler = subscriptable(loggingResponseHandler);

export const Preferences = new PreferenceManager(P, U.id + "-preference-", responseHandler.handler);
