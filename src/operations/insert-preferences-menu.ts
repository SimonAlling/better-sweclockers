import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "text";
import { Preferences } from "userscripter/preference-handling";
import { menuGenerator } from "../preferences-menu";
import { flush } from "lib/html";

export default () => {
    document.title = T.preferences.title;
    document.head.appendChild((() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = SITE.STYLESHEET_URL;
        return link;
    })());
    flush(document.body);
    document.body.appendChild(Preferences.htmlMenu(menuGenerator));
}
