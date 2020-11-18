// This file cannot contain Webpack-resolved imports (e.g. "~src/foo").

import U from "./userscript";
import { r } from "./utilities";

export const USERSCRIPT_ID = U.id;
export const USERSCRIPT_NAME = U.name;

export const PREFIX_ID = USERSCRIPT_ID + "-";
export const PREFIX_CLASS = USERSCRIPT_ID + "-";

// How long to wait between performing operations (DOM manipulation etc) during page load:
export const OPERATIONS_INTERVAL = 25; // ms
// How many extra tries to perform after DOMContentLoaded before considering remaining operations failed:
export const OPERATIONS_EXTRA_TRIES = 3;

const i = (x: string) => PREFIX_ID + x;
const c = (x: string) => PREFIX_CLASS + x;

export const ID_STYLE_ELEMENT = i("main-style-element");
export const EDITING_TOOLS_HEIGHT = "200px"; // to prevent jumping in preferences interface

// distance between article and left side of improved corrections dialog
export const CORRECTIONS_DIALOG_OFFSET_PX = 20;

// In adaptive width mode, the minimum width of the wrapper is the default narrow-layout wrapper width minus this amount:
export const WRAPPER_WIDTH_EXTRA_ALLOWED_SHRINK_AMOUNT = 60;

export const NBSP = "\u00A0";

export const ID = {
    developerTools: i("developer-tools"),
    document: i("document"),
    preferenceIdPrefix: i("preference-"),
    editingTools: i("editing-tools"),
    editingToolsPreferences: i("editing-tools-preferences"),
    darkThemeStylesheet: i("dark-theme-stylesheet"),
    darkThemeAdditions: i("dark-theme-additions"),
    interestsPreferences: i("interests-preferences"),
    style: {
        proofreading: i("proofreading"),
    },
} as const;

export const CLASS = {
    mousetrap: "mousetrap",
    developerTools: {
        // I couldn't use "error", because Soitora's dark theme would give such elements a weird red background.
        error: i("error"),
        warning: i("warning"),
    },
    disabled: c("disabled"),
    editingTools: c("editing-tools"),
    iconButton: c("icon-button"),
    pmButton: c("pm-button"),
    quoteSignatureButton: c("quote-signature-button"),
    mentionEveryoneButton: c("mention-everyone-button"),
    shibe: c("shibe"),
    button_restoreDraft: c("button-restore-draft"),
    button_color: c("button-color"),
    button_blockquote: c("button-blockquote"),
    button_spoiler: c("button-spoiler"),
    button_code: c("button-code"),
    button_math: c("button-math"),
    button_youtube: c("button-youtube"),
    splitQuote: c("split-quote"),
    colorPalette: c("color-palette"),
    smileys: c("smileys"),
    preference: c("preference"),
    preferenceDescription: c("preference-description"),
    inlinePreference: c("inline-preference"),
    primaryInlinePreference: c("primary-inline-preference"),
    radioButtonPreference: c("radioButtonPreference"),
    labeledInput: c("labeledInput"), // <label><input ... /></label>
    subforum: c("subforum"),
    textareaSize: c("textarea-size"),
    codeInput: c("code-input"),
    checkbox: c("checkbox"),
    uninteresting: c("uninteresting"),
} as const;

export const PATH = {
    PREFERENCES: {
        // Used for creating a link to the preferences menu:
        link: (sweclockersSettingsPath: string): string => (
            sweclockersSettingsPath + "/" + USERSCRIPT_ID
        ),
        // Used for checking whether we should show the preferences menu:
        check: (sweclockersSettingsPath: RegExp): RegExp => (
            new RegExp(sweclockersSettingsPath.source + r`\/` + USERSCRIPT_ID)
        ),
    },
} as const;

export const KEY = {
    autosaved_draft: i("autosaved_draft"),
    caret_position: i("caret_position_in_textarea"),
    last_time_user_tried_to_submit: i("last_time_user_tried_to_submit"),
    developer_tools_open: i("developer_tools_open"),
    draft_mode: i("draft_mode"),
} as const;

export const URL_LOGO = "https://github.com/SimonAlling/better-sweclockers/raw/master/docs/logo.png";

export const CONTENT = {
    indentation: "    ",
    shibeColor: `red`,
    shibeFont: `Comic Sans MS, Chalkboard SE, sans-serif`, // must be without quotes to work in BB
    splitQuoteEmptyLines: 3,
    edit: `[b]EDIT:[/b] `,
    doge: `[img]https://i.imgur.com/2IGEruO.png[/img]`,
} as const;

export const ICONS = {
    // Requiring an SVG file here throws when building.
    BLOCKQUOTE: `<div>”</div>`,
    DOGE: `https://i.imgur.com/2IGEruO.png`,
} as const;

export const FOCUSABLE_ELEMENTS = [ "textarea", "input", "select" ] as const;

export { SearchEngine } from "./search-engines";
