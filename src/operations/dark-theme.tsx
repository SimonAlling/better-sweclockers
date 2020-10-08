import * as ms from "milliseconds";
import { h, render } from "preact";
import { isNull } from "ts-type-guards";
import { disable } from "userscripter/lib/stylesheets";

import * as CONFIG from "~src/config";
import * as darkTheme from "~src/dark-theme";
import iconDarkThemeToggle from "~src/icons/dark-theme-toggle.svg";
import { P, Preferences } from "~src/preferences";
import STYLESHEETS from "~src/stylesheets";
import * as T from "~src/text";
import { timeIsWithin } from "~src/time";
import { withMaybe } from "~src/utilities";

export function insertToggle(e: {
    menuLockToggle: HTMLElement,
}) {
    const darkThemeToggle = document.createElement("li");
    e.menuLockToggle.insertAdjacentElement("afterend", darkThemeToggle);
    render((
        // Derived from the menu lock toggle.
        <li class="menu-lock menu-lock-active">
            <div
                class="menu-lock-click"
                title={T.general.dark_theme_toggle_tooltip(darkTheme.AUTHOR)}
                onClick={() => set(!Preferences.get(P.dark_theme._.active))}
            />
            <span class="menu-lock">
                <svg class="icon" dangerouslySetInnerHTML={{ __html: iconDarkThemeToggle }} />
            </span>
        </li>
    ), e.menuLockToggle.parentElement as Element, darkThemeToggle);
    disable(STYLESHEETS.dark_theme_toggle_preparations);
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
    const urlWithoutCacheInvalidation = Preferences.get(P.dark_theme._.use_backup) ? darkTheme.URL.backup : darkTheme.URL.canonical;
    const url = withCacheInvalidation(urlWithoutCacheInvalidation, new Date());
    if (newState) {
        if (isNull(document.getElementById(CONFIG.ID.darkThemeStylesheet))) {
            // Not document.head because it can be null, e.g. in a background tab in Firefox:
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            link.id = CONFIG.ID.darkThemeStylesheet;
            document.documentElement.appendChild(link);
        }
    } else {
        withMaybe(document.getElementById(CONFIG.ID.darkThemeStylesheet), element => element.remove());
    }
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

function withCacheInvalidation(url: string, date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1 /* 0-indexed */).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${url}?v=${yyyy}${mm}${dd}`;
}
