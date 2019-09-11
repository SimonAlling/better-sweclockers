import USERSCRIPT_CONFIG from "../config/userscript";

export function prefixer(prefix: string): (x: string) => string {
    return x => prefix + x;
}

export const USERSCRIPT_ID: string = USERSCRIPT_CONFIG.id;
export const USERSCRIPT_NAME: string = USERSCRIPT_CONFIG.name;
export const USERSCRIPT_VERSION_STRING: string = USERSCRIPT_CONFIG.version;
export const USERSCRIPT_AUTHOR: string = USERSCRIPT_CONFIG.author;

export const PREFIX_ID: string = USERSCRIPT_ID + "-";
export const PREFIX_CLASS: string = USERSCRIPT_ID + "-";

// How long to wait between performing operations (DOM manipulation etc) during page load:
export const INTERVAL_OPERATIONS: number = 25; // ms
// How long to wait after DOMContentLoaded before considering remaining operations failed:
export const TIMEOUT_OPERATIONS: number = 100; // ms

// Functions that prepend id and class prefixes:
const i = prefixer(PREFIX_ID);
const c = prefixer(PREFIX_CLASS);

export const ID_STYLE_ELEMENT: string = i("main-style-element");
export const EDITING_TOOLS_HEIGHT = "120px"; // to prevent jumping in preferences interface

// distance between article and left side of improved corrections dialog
export const CORRECTIONS_DIALOG_OFFSET_PX = 20;

export const ID = {
    document: i("document"),
    preferenceIdPrefix: i("preference-"),
    editingTools: i("editing-tools"),
    editingToolsPreferences: i("editing-tools-preferences"),
    darkThemeStylesheet: i("dark-theme-stylesheet"),
    darkThemeAdditions: i("dark-theme-additions"),
    darkThemeToggle: i("dark-theme-toggle"),
    preferencesShortcut: i("preferences-shortcut"),
    interestsPreferences: i("interests-preferences"),
    style: {
        proofreading: i("proofreading"),
    },
};

export const CLASS = {
    mousetrap: "mousetrap",
    disabled: c("disabled"),
    darkThemeActive: c("dark-theme-active"),
    editingTools: c("editing-tools"),
    iconButton: c("icon-button"),
    iconTab: c("icon-tab"),
    pmButton: c("pm-button"),
    quoteSignatureButton: c("quote-signature-button"),
    linkToTop: c("link-to-top"),
    shibe: c("shibe"),
    button_restoreDraft: c("button-restore-draft"),
    button_color: c("button-color"),
    button_quote: c("button-quote"),
    button_spoiler: c("button-spoiler"),
    button_code: c("button-code"),
    button_math: c("button-math"),
    button_youtube: c("button-youtube"),
    splitQuote: c("split-quote"),
    colorPalette: c("color-palette"),
    preference: c("preference"),
    preferenceDescription: c("preference-description"),
    inlinePreference: c("inline-preference"),
    primaryInlinePreference: c("primary-inline-preference"),
    radioButtonPreference: c("radioButtonPreference"),
    subforum: c("subforum"),
    textareaSize: c("textarea-size"),
    codeInput: c("code-input"),
};

export const PATH = {
    PREFERENCES: (sweclockersSettingsPath: string): string => sweclockersSettingsPath + "/" + USERSCRIPT_ID,
};

export const KEY = {
    autosaved_draft: i("autosaved_draft"),
    caret_position: i("caret_position_in_textarea"),
    last_time_user_tried_to_submit: i("last_time_user_tried_to_submit"),
};

export const URL_LOGO = "https://cdn.sweclockers.com/artikel/bild/63329?l=eyJyZXNvdXJjZSI6IlwvYXJ0aWtlbFwvYmlsZFwvNjMzMjkiLCJmaWx0ZXJzIjpbInQ9b3JpZ2luYWwiXSwicGFyYW1zIjpbXSwia2V5IjoiYzk3ODM1MmY4NDVkM2YwOWY3M2UwYWRmODZlMjk1MmIifQ%3D%3D";

export const CONTENT = {
    indentation: "    ",
    shibeColor: `red`,
    shibeFont: `Comic Sans MS, Chalkboard SE, sans-serif`, // must be without quotes to work in BB
    splitQuoteEmptyLines: 3,
    edit: `[b]EDIT:[/b] `,
    doge: `[img]https://i.imgur.com/2IGEruO.png[/img]`,
};

export const ICONS = {
    // Requiring an SVG file here throws when building.
    QUOTE: `<div>”</div>`,
    DOGE: `https://i.imgur.com/2IGEruO.png`,
};

export const FOCUSABLE_ELEMENTS = [ "textarea", "input", "select" ];

export const enum SearchEngine {
    // Be careful! These strings are used in the UI.
    GOOGLE = "Google",
    DUCKDUCKGO = "DuckDuckGo",
}
