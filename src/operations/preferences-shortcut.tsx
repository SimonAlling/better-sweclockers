import { render } from "preact";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { tab } from "./logic/topMenuTab";

export default (e: { topMenu: HTMLElement }) => {
    const button = tab({
        title: T.preferences.title,
        id: CONFIG.ID.preferencesShortcut,
        link: {
            href: CONFIG.PATH.PREFERENCES.link(SITE.PATH.SETTINGS.link),
            openInNewTab: true,
        },
    });
    render(button, e.topMenu);
};
