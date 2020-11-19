import { h } from "preact";

import * as CONFIG from "~src/config";
import { insertAtTheBeginning, renderIn } from "~src/operations/logic/render";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: {
    notificationsBar: HTMLElement,
}) => {
    renderIn(e.notificationsBar, insertAtTheBeginning, (
        // Derived from the other links in the notifications bar.
        <a
            href={CONFIG.PATH.PREFERENCES.link(SITE.PATH.SETTINGS.link)}
            title={T.preferences._.title}
            class="margin-medium-right"
        >
            <svg class="icon" dangerouslySetInnerHTML={{ __html: SITE.ICONS.settings }} />
            <span class="margin-small-left display-none display-l-inherit">
                {T.preferences._.shortcut_label}
            </span>
        </a>
    ));
};
