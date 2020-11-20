import { h } from "preact";

import { insertAtTheEnd, renderIn } from "~src/operations/logic/render";
import { PreferencesForm } from "~src/preferences-menu";
import * as SITE from "~src/site";
import * as T from "~src/text";
import { yyyymmdd } from "~src/utilities";

export default () => {
    document.title = T.preferences._.title;
    document.documentElement.appendChild((() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = SITE.STYLESHEET_URL(yyyymmdd(new Date()));
        return link;
    })());
    renderIn(document.body, insertAtTheEnd, <PreferencesForm />);
};
