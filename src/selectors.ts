import "css.escape"; // It is side-effecty.

import * as SITE from "~src/site";

const C = SITE.CLASS;

const settingsNavigation = `ul.${C.settingsNavigation}`;

const searchFieldWrapper = `#search .searchField`;

const actionButtons = `button[name=action]`;
const actionButtonsQuickReply = `#quickreply .controls button`;
const forumPostContainer = "." + SITE.CLASS.forumPosts;

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
    actionButtons,
    previewButton: actionButtons + `[value=${SITE.FORM.value.preview}]`,
    saveButton: actionButtons + `[value=${SITE.FORM.value.submit}]`,
    saveButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(1)`,
    previewButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(2)`,
    forumPostContainer,
    replyButtonAfterForumPosts: `${forumPostContainer} ~ * .replyToThread`,
    cityInput: `input[name="city"]`,
    regionSelect: `select[name="location"]`,
    sideColumnAnniversary: `.swec20Box.${C.sideBox}`,
    sideColumnGuides: `.videoPush.${C.sideBox}`,
    sideColumnPopularGalleries: `.popularGalleries.${C.sideBox}`,
    bbParagraph: `.bbParagraph`,
    forumLink: `.subForums a[href^="/forum/"]`,
    forumPost: "." + SITE.CLASS.forumPost,
    forumPostAuthorLink: `.name a`,
    linkedForumPost: `.` + SITE.CLASS.forumPost + `.isLinked`,
    listBulkActions: `#postActions .listBulkActions`,
    quickReplyForm: `#quickreply form`,
    signinSectionOr: (selector: string) => "." + SITE.CLASS.signinSection + ", " + selector, // Order doesn't matter.
    followedThreadsLinkText: `#${SITE.ID.siteHeader} .profile .option.watched a.label>span:not(.icon)`,
    proofDialogCloseButton: "." + SITE.CLASS.proofDialog + " .cntClose",
} as const;
