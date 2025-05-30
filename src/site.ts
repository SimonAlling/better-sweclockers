// This file cannot contain Webpack-resolved imports (e.g. "~src/foo").

import U from "./userscript";

export const NAME = U.sitename;
export const HOSTNAME = U.hostname;
export const HOSTNAME_MOBILE = `m.` + HOSTNAME;

export const STYLESHEET_URL = (yyyymmdd: string) => `/css/main.css?v=${yyyymmdd}`;

export const BANNER_HEIGHT_SIDE = `${370}px`; // default height of sidebar ad modules
export const BANNER_HEIGHT_MID = `${341}px`; // default height of front page inter-article ad modules
export const BANNER_HEIGHT_BETWEEN_FORUM_POSTS = `${320}px`; // default height of forum-thread inter-post ad modules on mobile (or just narrow viewport in general)
export const WRAPPER_WIDTH_WIDE_PX = 1250;
export const WRAPPER_WIDTH_NARROW_PX = 1000;
export const MAX_WIDTH_FOR_NARROW_LAYOUT_PX = 1100;
export const EXTRA_TAB_MARGIN = `${8}px`;
export const GUTTER_SIZE_PX = 6; // the small padding to the very left and right
export const ARTICLE_WIDTH_PX = 680;
export const WIDTH_WHERE_NARROW_LAYOUT_GOES_CENTERED = WRAPPER_WIDTH_NARROW_PX + 2 * GUTTER_SIZE_PX;
export const WIDTH_WHERE_WIDE_LAYOUT_GOES_CENTERED = WRAPPER_WIDTH_WIDE_PX + 2 * GUTTER_SIZE_PX;

export const ID = {
    header: "header",
    footer: "footer",
    carousel: "carousel",
    correctionsLink: "proofArticle",
    postPreview: "preview",
    latestNewsWidget: "wdgtMainRecentNews",
    newInForumWidget_main: "wdgtMainRecentThreads",
    newInForumWidget_side: "wdgtSideRecentThreads",
    newInMarketWidget: "wdgtSideRecentClassifieds",
    newInTestLabWidget: "wdgtSideRecentReviews",
    inTheStoreWidget: "wdgtSideGeeksShop",
    popularAtPrisjaktWidget: "wdgtSidePopularProducts",
    newTechJobsWidget: "wdgtSideMonsterJobs",
    externalNewsWidget: "wdgtSideExternalFeeds",
} as const;

export const CLASS = {
    fieldset: "s5fieldset",
    button: "button",
    link: "link",
    icon: "icon",
    label: "label",
    disabled: "is-disabled",
    inner: "inner",
    colorOrange: "color-orange",
    menuItem: "menu-item",
    settingsNavigation: "menu-items",
    forumPosts: "forum-posts",
    forumPost: "forum-post",
    forumPostProfileDetails: "details",
    forumPostSignature: "signature",
    forumPostControls: "controls",
    forumPostByCurrentUser: "isReader", // Don't use isAuthor; it means submitted by OP!
    bbcode: "bbcode",
    bbDel: "bbDel",
    bbImage: "bbImage",
    bbIns: "bbIns",
    imgControls: "imgControls",
    notifications: "profile-nav__notifications",
    proofDialog: "proofDialog",
    socialMediaButtons: [ `threadShare`, `greyContentShare`, `sideShare` ],
    sideBox: "sideBox",
    smiley: "smiley",
    subforums: "subforums",
    toolbarGroup: "tbGroup",
    toolbarButton: "tbButton iconButton noselect",
    toolbarButtonIcon: "btnIcon",
    toolbarHeadingButton: "header",
    toolbarTableButton: "tbl",
} as const;

export const FORM = {
    name: {
        action: "action",
        csrfToken: "csrf",
        message: "message",
        recipients: "rcpt[]",
        title: "title",
    },
    value: {
        preview: "doPreview",
        submit: "doSubmit",
    },
} as const;

export const PATH = {
    EDIT_MODE_FORUM: /^\/forum\/(.*\/(svara(\?citera)?|redigera)|ny-trad)/,
    EDIT_MODE_MARKET: /^\/marknad\/(.+\/(redigera|kontakt)|ny-annons)$/,
    EDIT_MODE_MARKET_CONTACT: /^\/marknad\/.+\/kontakt$/,
    EDIT_MODE_PM: /^\/medlem\/\d+\/meddelanden\/(?:nytt-meddelande|post\/\d+\/(?:redigera|svara))/,
    EDIT_MODE_REPORT: /^\/(forum|marknad|medlem\/\d+\/meddelanden)\/.+\/anmal$/,
    EDIT_MODE_SIGNATURE: /^\/medlem\/\d+\/installningar\/signatur$/,
    SETTINGS: {
        link: "/profil/installningar", // Relying on this path being redirected to the actual settings path allows us to create a link to the preferences page without knowing the user's ID.
        check: /^\/medlem\/\d+\/installningar/, // Should not have a "$" because it should match subpaths too.
    },
    ARCHIVE: "/arkiv",
    FOLLOWED: "/forum/foljda",
    MY_POSTS: "/profil/inlagg",
    SIGNIN: `/konto/logga-in`,
    SIGNOUT: `/konto/logga-ut`,
    ARTICLE: /^\/artikel\//,
    GUIDE: /^\/guide\//,
    NEWS: /^\/nyhet\//,
    COMPETITION: /^\/tavling\//,
    TEST: /^\/test\//,
    TESTPILOT: /^\/testpilot\//,
    FORUM_CATEGORY: /\/forum\/(\d+)/,
    FORUM: "/forum",
    FORUM_THREADS_VIEW: /^\/forum\/(aktiva|obesvarade|foljda|skapade|lasta)$/,
    PROFILE: (userId: number | "\\d+") => new RegExp(`^/medlem/${userId}$`),
    THREAD: /^\/(?:forum|medlem\/\d+\/meddelanden)\/trad\//,
    POST: /^\/(?:forum|medlem\/\d+\/meddelanden)\/post\//,
    newPrivateMessage: (sender: number) => `/medlem/${sender}/meddelanden/nytt-meddelande`,
    forumPost: (postID: string) => `/forum/post/${postID}`,
} as const;

export const TAG = {
    abbr: "abbr",
    b: "b",
    bq: "bq",
    cmd: "cmd",
    code: "code",
    color: "color",
    del: "del",
    dd: "dd",
    dl: "dl",
    dt: "dt",
    expander: "expander",
    font: "font",
    h: "h",
    i: "i",
    img: "img",
    ins: "ins",
    mark: "mark",
    math: "math",
    noparse: "noparse",
    pre: "pre",
    quote: "quote",
    size: "size",
    spoiler: "spoiler",
    sub: "sub",
    sup: "sup",
    u: "u",
    url: "url",
} as const;

const URL_ICONS_TOOLBAR = "/gfx/toolbar2x.png";
export const ICONS = {
    toolbarIcon: (position: string): string => `<div style="background-image: url('${URL_ICONS_TOOLBAR}'); background-size: 500px auto; background-position: ${position};"></div>`,
    position_toolbar_url: "0 -125px",
    position_toolbar_img: "-50px -125px",
    settings: `<use xlink:href="/gfx/iconmap.svg#icon_settings"></use>`,
} as const;

export const MOBILE_SITE_DISCLAIMER = {
    sentFrom: `Skickades från`,
    mobileSiteDomain: HOSTNAME_MOBILE,
} as const;

const USER_ID_NOT_LOGGED_IN = 1;

type UserInfo = (
    | { tag: "CouldNotExtract" }
    | { tag: "NotLoggedIn" }
    | { tag: "LoggedIn", userID: number }
);

export function getUserInfo(): UserInfo {
    const userID: unknown = (window as any)?.session?._userid;
    if (typeof userID !== "number") {
        return { tag: "CouldNotExtract" };
    }
    return (
        userID === USER_ID_NOT_LOGGED_IN
            ? { tag: "NotLoggedIn" }
            : { tag: "LoggedIn", userID }
    );
}
