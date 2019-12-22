import { h, render } from "preact";

import * as CONFIG from "src/globals-config";
import * as SITE from "src/globals-site";
import * as T from "src/text";

export default (e: { settingsNavigation: HTMLElement }) => {
    const li = (
        <li title={T.general.preferences_link} class={SITE.CLASS.menuItem}>
            <a href={CONFIG.PATH.PREFERENCES.link(SITE.PATH.SETTINGS.link)} class={SITE.CLASS.link}>
                <span class={SITE.CLASS.icon}></span>
                {" "} {/* SweClockers relies on whitespace for spacing here. */}
                <span class={SITE.CLASS.label}>{T.general.preferences_link}</span>
            </a>
        </li>
    );
    render(li, e.settingsNavigation);
}
