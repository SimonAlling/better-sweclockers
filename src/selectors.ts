import * as SITE from "globals-site";
import * as CONFIG from "globals-config";

require("css.escape");

const C = SITE.CLASS;

const settingsNavigation = `ul.${C.settingsNavigation}`;
const settingsNavigationItem = `${settingsNavigation} > li.${C.menuItem}`;

const searchFieldWrapper = `#search .searchField`;

const actionButtons = `button[name=action]`;
const actionButtonsQuickReply = `#quickreply .controls button`;

const textareaToolbarInner = `form .toolbar .tbInner`;

export default {
    textarea: "textarea#" + CSS.escape(SITE.ID.textarea),
    textareaToolbarInner,
    textareaToolbarStrikeButton: textareaToolbarInner + ` .strike`,
    textareaToolbarUnorderedListButton: textareaToolbarInner + ` .ul`,
    proofDialogTextarea: `.${SITE.CLASS.proofDialog} textarea`,
    topMenu: `#mainMenu ul`,
    siteHeader: `#` + SITE.ID.siteHeader,
    moreArticles: `.mainContent ~ .mainContent`,
    searchFieldWrapper,
    searchFieldInput: `${searchFieldWrapper} input`,
    settingsNavigation,
    settingsNavigationItem,
    settingsNavigationLabel: `${settingsNavigationItem} > a.${C.link} > span.${C.icon} + span.${C.label}`,
    actionButtons,
    previewButton: actionButtons + `[value=doPreview]`,
    saveButton: actionButtons + `[value=doSubmit]`,
    saveButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(1)`,
    previewButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(2)`,
    sideColumnAnniversary: `.swec20Box.${C.sideBox}`,
    sideColumnGuides: `.videoPush.${C.sideBox}`,
    sideColumnPopularGalleries: `.popularGalleries.${C.sideBox}`,
    bbParagraph: `.bbParagraph`,
    forumLink: `.subForums a[href^="/forum/"]`,
    forumPostAuthorLink: `.name a`,
    listBulkActions: `#postActions .listBulkActions`,
    quickReplyForm: `#quickreply form`,
    followedThreadsLinkText: `#${SITE.ID.siteHeader} .profile .option.watched a.label>span:not(.icon)`,
    proofDialogCloseButton: "." + SITE.CLASS.proofDialog + " .cntClose",
};
