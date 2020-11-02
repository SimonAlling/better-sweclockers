import { h, render } from "preact";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: {
    notificationsBar: HTMLElement,
}) => {
    const placeholder = document.createElement("a");
    e.notificationsBar.insertAdjacentElement("afterbegin", placeholder);
    render((
        <a
            href={CONFIG.PATH.PREFERENCES.link(SITE.PATH.SETTINGS.link)}
            title={T.preferences.title}
            class="margin-medium-right"
        >
            <svg class="icon" dangerouslySetInnerHTML={{ __html: SITE.ICONS.settings }} />
            <span class="margin-small-left display-none display-l-inherit">
                {T.preferences.shortcut_label}
            </span>
        </a>
    ), e.notificationsBar, placeholder);
};
