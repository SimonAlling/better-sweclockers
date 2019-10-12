import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { h, render } from "preact";

export default (e: { settingsNavigation: HTMLElement }) => {
    const li = (
        <li title={CONFIG.USERSCRIPT_NAME} class={SITE.CLASS.menuItem}>
            <a href={CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS)} class={SITE.CLASS.link}>
                <span class={SITE.CLASS.icon}></span>
                {" "} {/* SweClockers relies on whitespace for spacing here. */}
                <span class={SITE.CLASS.label}>{CONFIG.USERSCRIPT_NAME}</span>
            </a>
        </li>
    );
    render(li, e.settingsNavigation);
}
