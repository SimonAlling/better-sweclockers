import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";
import { isNull } from "ts-type-guards";
import * as ms from "milliseconds";
import { isHTMLElement } from "lib/html";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { darkThemeUrl, darkThemeUrlBackup } from "src/dark-theme";

const DARK_THEME_ADDITIONS = require("../styles/dark-theme-additions");

export function insertToggle(e: { lastTab: HTMLElement }): void {
    const state = Preferences.get(P.dark_theme._.active);
    const source = Preferences.get(P.dark_theme._.source);
    const button = (
        <li
            title={state ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on(source)}
            class={[SITE.CLASS.menuItem].concat(state ? CONFIG.CLASS.darkThemeActive : []).join(" ")}
            id={CONFIG.ID.darkThemeToggle}
        >
            <a href="javascript:void(0)" onClick={() => {
                set(!Preferences.get(P.dark_theme._.active));
            }}>
                <span>&nbsp;</span>
            </a>
        </li>
    );
    render(button, e.lastTab.parentElement as HTMLElement);
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
            render(<link rel="stylesheet" href={url(source)} id={CONFIG.ID.darkThemeStylesheet} />, document.head);
            render((
                <style id={CONFIG.ID.darkThemeAdditions}>
                    {DARK_THEME_ADDITIONS}
                </style>
            ), document.head);
        }
    } else {
        [
            CONFIG.ID.darkThemeStylesheet,
            CONFIG.ID.darkThemeAdditions,
        ].forEach(id => {
            const element = document.getElementById(id);
            if (isHTMLElement(element)) {
                element.remove();
            }
        });
    }
    const toggle = document.getElementById(CONFIG.ID.darkThemeToggle);
    if (isHTMLElement(toggle)) {
        const active = CONFIG.CLASS.darkThemeActive;
        newState ? toggle.classList.add(active) : toggle.classList.remove(active);
        toggle.title = newState ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on(source);
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

function timeIsWithin(interval: Readonly<{ start: number, end: number }>) {
    return (time: Date): boolean => {
        const t = timeOfDay(time);
        const start = interval.start;
        const end = interval.end;
        return (
            end < start
            ? t >= start || t < end
            : t >= start && t < end
        );
    };
}

function timeOfDay(date: Date): number {
    let startOfToday = new Date();
    startOfToday.setHours(0);
    startOfToday.setMinutes(0);
    startOfToday.setSeconds(0);
    startOfToday.setMilliseconds(0);
    return date.getTime() - startOfToday.getTime();
}
