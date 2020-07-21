import { h, render } from "preact";

import { PreferencesForm } from "~src/preferences-menu";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default () => {
    document.title = T.preferences.title;
    document.documentElement.appendChild((() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = SITE.STYLESHEET_URL;
        return link;
    })());
    render(<PreferencesForm />, document.body);
};
