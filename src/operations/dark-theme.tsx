import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";
import { isNull } from "ts-type-guards";
import * as ms from "milliseconds";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { darkThemeUrl, darkThemeUrlBackup } from "src/dark-theme";
import { timeIsWithin } from "../time";
import { withMaybe } from "../utilities";
import { tab } from "./logic/topMenuTab";

export function insertToggle(e: { topMenu: HTMLElement }): void {
    const state = Preferences.get(P.dark_theme._.active);
    const source = Preferences.get(P.dark_theme._.source);
    const button = tab({
        title: state ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on(source),
        id: CONFIG.ID.darkThemeToggle,
        classes: state ? [CONFIG.CLASS.darkThemeActive] : [],
        link: {
            onClick: () => set(!Preferences.get(P.dark_theme._.active)),
        },
    });
    render(button, e.topMenu);
}

export function manage(): void {
    if (Preferences.get(P.dark_theme._.active)) {
        apply(true);
    }
    if (Preferences.get(P.dark_theme._.auto)) {
        sheldon();
        setInterval(sheldon, ms.seconds(Preferences.get(P.dark_theme._.interval)));
    }
}

function apply(newState: boolean): void {
    const source = Preferences.get(P.dark_theme._.source);
    const url = Preferences.get(P.dark_theme._.use_backup) ? darkThemeUrlBackup : darkThemeUrl;
    if (newState) {
        if (isNull(document.getElementById(CONFIG.ID.darkThemeStylesheet))) {
            // Not document.head because it can be null, e.g. in a background tab in Firefox:
            render(<link rel="stylesheet" href={url(source)} id={CONFIG.ID.darkThemeStylesheet} />, document.documentElement);
        }
    } else {
        withMaybe(document.getElementById(CONFIG.ID.darkThemeStylesheet), element => element.remove());
    }
    withMaybe(document.getElementById(CONFIG.ID.darkThemeToggle), toggle => {
        const active = CONFIG.CLASS.darkThemeActive;
        newState ? toggle.classList.add(active) : toggle.classList.remove(active);
        toggle.title = newState ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on(source);
    });
}

function set(newState: boolean): void {
    Preferences.set(P.dark_theme._.active, newState);
    apply(newState);
}

function sheldon(): void {
    // Sheldon cannot do the same thing twice in a row, because the user must be able to override him.
    const whatSheldonWants = timeIsWithin({
        start: Preferences.get(P.dark_theme._.time_on),
        end: Preferences.get(P.dark_theme._.time_off),
    })(new Date());
    const whatSheldonDidLast = Preferences.get(P.dark_theme._.last_autoset_state);
    if (whatSheldonWants !== whatSheldonDidLast) {
        Preferences.set(P.dark_theme._.last_autoset_state, whatSheldonWants);
        set(whatSheldonWants);
    }
    // If the dark theme was toggled (auto or not) in another tab, Sheldon must toggle it here as well:
    apply(Preferences.get(P.dark_theme._.active));
}
