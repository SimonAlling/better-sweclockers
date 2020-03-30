import darkThemeAdditionsBlargmode from "~src/stylesheets/dark-theme-additions-blargmode.scss";

export const enum Source {
    // Be careful! These strings are used in the UI.
    BLARGMODE = "Blargmode",
    SOITORA = "Soitora",
}

export function darkThemeUrl(source: Source): string {
    switch (source) {
        case Source.BLARGMODE: return "https://blargmode.se/files/swec_dark_theme/style.css";
        case Source.SOITORA: return "https://soitora.com/xhs-styles/sweclockers.css";
    }
}

export function darkThemeAdditions(source: Source): string {
    switch (source) {
        case Source.BLARGMODE:
            return darkThemeAdditionsBlargmode;
        default:
            return "";
    }
}

export function darkThemeUrlBackup(source: Source): string {
    return `https://simonalling.se/userscripts/better-sweclockers/dark-theme-${source.toLowerCase()}.css`;
}
