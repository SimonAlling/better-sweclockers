import * as SITE from "~src/site";

const C = SITE.CLASS;

const settingsNavigation = `ul.${C.settingsNavigation}`;

const actionButtons = `button[name=action]`;
const actionButtonsQuickReply = `#quickreply .controls button`;
const forumPostContainer = "." + SITE.CLASS.forumPosts;
const signoutButton = `a[href="${SITE.PATH.SIGNOUT}"]`;

const textareaToolbarInner = `form .toolbar .tbInner`;

export default {
    textarea: "textarea#" + CSS.escape(SITE.ID.textarea),
    textareaToolbarInner,
    textareaToolbarStrikeButton: textareaToolbarInner + ` .strike`,
    textareaToolbarUnorderedListButton: textareaToolbarInner + ` .ul`,
    proofDialogTextarea: `.${SITE.CLASS.proofDialog} textarea`,
    threadTitle: `h1`,
    moreArticles: `.mainContent ~ .mainContent`,
    settingsNavigation,
    actionButtons,
    quoteButton: "a.button.quote",
    previewButton: actionButtons + `[value=${SITE.FORM.value.preview}]`,
    saveButton: actionButtons + `[value=${SITE.FORM.value.submit}]`,
    saveButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(1)`,
    previewButtonQuickReply: actionButtonsQuickReply + `:nth-of-type(2)`,
    forumPostContainer,
    replyButtonAfterForumPosts: `${forumPostContainer} ~ * .replyToThread`,
    cityInput: `input[name="city"]`,
    regionSelect: `select[name="location"]`,
    sideColumnGuides: `.videoPush.${C.sideBox}`,
    sideColumnPopularGalleries: `.popularGalleries.${C.sideBox}`,
    bbParagraph: `.bbParagraph`,
    forumLink: `.subForums td:first-child > * a[href^="/forum/"]`, // Have to be this specific because there are other random links that we don't want to match.
    forumPost: "." + SITE.CLASS.forumPost,
    forumPostAuthorLink: `a.name[itemprop="author"]`,
    linkedForumPost: `.` + SITE.CLASS.forumPost + `.is-linked`,
    pageNavigationAfterForumPosts: `${forumPostContainer} ~ * .pages`,
    quickReplyForm: `#quickreply form`,
    signoutButton,
    signinButtonOr: (selector: string) => `a[href="${SITE.PATH.SIGNIN}"], ${selector}`, // Order doesn't matter.
    followedThreadsLinkText: `#${SITE.ID.header} a[href="${SITE.PATH.FOLLOWED}"] span`,
    proofDialogCloseButton: "." + SITE.CLASS.proofDialog + " .cntClose",
} as const;
