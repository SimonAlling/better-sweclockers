import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

require("css.escape");

const C = SITE.CLASS;

const settingsNavigation = `ul.${C.settingsNavigation}`;
const settingsNavigationItem = `${settingsNavigation} > li.${C.menuItem}`;

const actionButtons = `button[name=action]`;

export default {
    textarea: "textarea#" + CSS.escape(SITE.ID.textarea),
    lastNavigationTab: `.${C.menu} > li.${C.menuItem}:last-child`,
    siteHeader: `#` + SITE.ID.siteHeader,
    settingsNavigation,
    settingsNavigationItem,
    settingsNavigationLabel: `${settingsNavigationItem} > a.${C.link} > span.${C.icon} + span.${C.label}`,
    actionButtons,
    previewButton: actionButtons + `[value=doPreview]`,
    sideColumnGuides: `.videoPush.${C.sideBox}`,
    sideColumnPopularGalleries: `.popularGalleries.${C.sideBox}`,
    forumLink: `.subForums a[href^="/forum/"]`,
    forumPostAuthorLink: `.name a`,
    quickReplyForm: `#quickreply form`,
};
