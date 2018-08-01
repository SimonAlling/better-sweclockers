import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

require("css.escape");

const C = SITE.CLASS;

const settingsNavigation = `ul.${C.settingsNavigation}`;
const settingsNavigationItem = `${settingsNavigation} > li.${C.menuItem}`;

export default {
    textarea: "textarea#" + CSS.escape(SITE.ID.textarea),
    lastNavigationTab: `.${C.menu} > li.${C.menuItem}:last-child`,
    settingsNavigation,
    settingsNavigationItem,
    settingsNavigationLabel: `${settingsNavigationItem} > a.${C.link} > span.${C.icon} + span.${C.label}`,
};
