import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";

export function insertToggle(e: { lastTab: HTMLElement }): void {
    const state = Preferences.get(P.dark_theme._.active);
    const button = (
        <li
            title={state ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on}
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
        setInterval(sheldon, CONFIG.DARK_THEME.refreshInterval);
    }
}

function apply(newState: boolean): void {
    if (newState) {
        render(<link rel="stylesheet" href={CONFIG.DARK_THEME.url} id={CONFIG.ID.darkThemeStylesheet} />, document.head);
    } else {
        const element = document.getElementById(CONFIG.ID.darkThemeStylesheet);
        if (element instanceof HTMLElement) {
            element.remove();
        }
    }
    const toggle = document.getElementById(CONFIG.ID.darkThemeToggle);
    if (toggle instanceof HTMLElement) {
        const active = CONFIG.CLASS.darkThemeActive;
        newState ? toggle.classList.add(active) : toggle.classList.remove(active);
        toggle.title = newState ? T.general.dark_theme_toggle_tooltip_off : T.general.dark_theme_toggle_tooltip_on;
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
}

function timeIsWithin(interval: { readonly start: number, readonly end: number }) {
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
