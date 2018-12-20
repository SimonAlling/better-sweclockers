import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";

export default (e: { lastTab: HTMLElement }) => {
    const button = (
        <li
            title={T.preferences.title}
            class={SITE.CLASS.menuItem}
            id={CONFIG.ID.preferencesShortcut}
        >
            <a href={CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS)} target="_blank">
                <span>&nbsp;</span>
            </a>
        </li>
    );
    render(button, e.lastTab.parentElement as HTMLElement);
}
