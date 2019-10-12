import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { render } from "preact";
import { tab } from "./logic/topMenuTab";

export default (e: { topMenu: HTMLElement }) => {
    const button = tab({
        title: T.preferences.title,
        id: CONFIG.ID.preferencesShortcut,
        link: {
            href: CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS),
            openInNewTab: true,
        },
    });
    render(button, e.topMenu);
}
