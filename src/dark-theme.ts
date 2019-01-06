import { assertUnreachable } from "src/utilities";

export const enum Source {
    // Be careful! These strings are used in the UI.
    BLARGMODE = "Blargmode",
    SOITORA = "Soitora",
}

export function darkThemeUrl(source: Source): string {
    switch (source) {
        case Source.BLARGMODE: return "https://blargmode.se/files/swec_dark_theme/style.css";
        case Source.SOITORA: return "https://gitcdn.xyz/repo/Soitora/XHS-Styles/master/sweclockers-pure.css";
    }
    return assertUnreachable(source);
}

export function darkThemeUrlBackup(source: Source): string {
    return `https://simonalling.se/userscripts/better-sweclockers/dark-theme-${source.toLowerCase()}.css`;
}
