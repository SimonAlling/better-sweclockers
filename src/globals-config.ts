import USERSCRIPT_CONFIG from "../config/userscript";
import * as ms from "milliseconds";

function prefixer(prefix: string): (x: string) => string {
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

export const ID = {
    editingTools: i("editing-tools"),
    darkThemeStylesheet: "dark-theme-stylesheet",
    darkThemeToggle: "dark-theme-toggle",
};

export const CLASS = {
    darkThemeActive: c("dark-theme-active"),
    iconButton: c("icon-button"),
    shibe: c("shibe"),
    button_color: c("button-color"),
    button_quote: c("button-quote"),
    button_spoiler: c("button-spoiler"),
    button_code: c("button-code"),
    button_math: c("button-math"),
    button_youtube: c("button-youtube"),
    splitQuote: c("split-quote"),
    preferenceDescription: c("preference-description"),
    inlinePreference: c("inlinePreference"),
    radioButtonPreference: c("radioButtonPreference"),
};

export const PATH = {
    PREFERENCES: (sweclockersSettingsPath: string): string => sweclockersSettingsPath + "/" + USERSCRIPT_ID,
};

export const URL_LOGO = "https://cdn.sweclockers.com/artikel/bild/63329?l=eyJyZXNvdXJjZSI6IlwvYXJ0aWtlbFwvYmlsZFwvNjMzMjkiLCJmaWx0ZXJzIjpbInQ9b3JpZ2luYWwiXSwicGFyYW1zIjpbXSwia2V5IjoiYzk3ODM1MmY4NDVkM2YwOWY3M2UwYWRmODZlMjk1MmIifQ%3D%3D";

export const DARK_THEME = {
    url: "https://blargmode.se/files/swec_dark_theme/style.css",
    refreshInterval: ms.seconds(30),
    enableAt: ms.hours(21),
    disableAt: ms.hours(7),
};

export const CONTENT = {
    shibeColor: `red`,
    shibeFont: `Comic Sans MS, Chalkboard SE, sans-serif`, // must be without quotes to work in BB
    splitQuoteEmptyLines: 3,
    edit: `[b]EDIT:[/b] `,
    doge: `[img]https://i.imgur.com/2IGEruO.png[/img]`,
};

export const ICONS = {
    SPLIT_QUOTE: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <rect x="1" y="-3" width="30" height="10" stroke="#444" fill="#d7d5d1" stroke-width="2"/>
            <rect x="1" y="19" width="30" height="22" stroke="#444" fill="#d7d5d1" stroke-width="2"/>
            <text x="0" y="13" style="fill: #444; font-family: sans-serif; font-size: 4px">Du har fel.</text>
            <text x="4" y="36" style="fill: #444; font-family: Georgia, serif; font-size: 20px">”</text>
        </svg>
    `,
    SEARCH_LINK: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <circle stroke="#888" stroke-width="5" r="20" cx="41" cy="23" fill="none"/>
            <line x1="4" y1="60" x2="28" y2="36" stroke="#888" stroke-width="10" />
        </svg>
    `,
    QUOTE: `<div>”</div>`,
    DOGE: `https://i.imgur.com/2IGEruO.png`,
};
