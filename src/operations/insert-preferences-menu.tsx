import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "text";
import { PreferencesForm } from "../preferences-menu";
import { render, h } from "preact";

export default () => {
    document.title = T.preferences.title;
    document.head.appendChild((() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = SITE.STYLESHEET_URL;
        return link;
    })());
    render(<PreferencesForm />, document.body);
}
