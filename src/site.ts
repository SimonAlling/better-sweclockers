// This file cannot contain Webpack-resolved imports (e.g. "~src/foo").

import U from "./userscript";

export const NAME = U.sitename;
export const HOSTNAME = U.hostname;
export const HOSTNAME_MOBILE = `m.` + HOSTNAME;

export const STYLESHEET_URL = "/css/combine.min.css";

export const BANNER_HEIGHT_TOP = `${121}px`; // default height of top ad banner
export const BANNER_HEIGHT_MID = `${360}px`; // default height of page ad modules
export const WRAPPER_WIDTH_WIDE_PX = 1250;
export const WRAPPER_WIDTH_NARROW_PX = 1000;
export const MAX_WIDTH_FOR_NARROW_LAYOUT_PX = 1100;
export const EXTRA_TAB_MARGIN = `${8}px`;
export const GUTTER_SIZE_PX = 6; // the small padding to the very left and right
export const OUTSIDER_COLUMN_FIXED_WIDTH_PX = 250;
export const INSIDER_COLUMN_FIXED_WIDTH_PX = 314;
export const ARTICLE_WIDTH_PX = 680;
export const WIDTH_WHERE_NARROW_LAYOUT_GOES_CENTERED = WRAPPER_WIDTH_NARROW_PX + 2 * GUTTER_SIZE_PX;
export const WIDTH_WHERE_WIDE_LAYOUT_GOES_CENTERED = WRAPPER_WIDTH_WIDE_PX + 2 * GUTTER_SIZE_PX;

export const ID = {
    siteHeader: "siteHeader",
    signoutButton: "signoutForm",
    textarea: "__laika_cnt.textarea.0",
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
    inner: "inner",
    menuItem: "menuItem",
    settingsNavigation: "menuItems",
    forumPosts: "forumPosts",
    forumPost: "forumPost",
    forumPostProfileDetails: "details",
    forumPostSignature: "signature",
    forumPostControls: "controls",
    forumPostBtnGroup: "btnGroup",
    forumPostByCurrentUser: "isReader", // Don't use isAuthor; it means submitted by OP!
    threadStatus: "threadStatus",
    threadStatusIcon: (bitmask: number) => `icon-${bitmask}`,
    bbImage: "bbImage",
    imgControls: "imgControls",
    errorDialog: "errorDialog",
    proofDialog: "proofDialog",
    socialMediaButtons: [ `threadShare`, `greyContentShare`, `sideShare` ],
    sideBox: "sideBox",
    signinSection: "signin",
    subforumLink: "link",
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
    EDIT_MODE_MARKET: /^\/marknad\/(.+\/(redigera|kontakt)|ny\-annons)$/,
    EDIT_MODE_MARKET_CONTACT: /^\/marknad\/.+\/kontakt$/,
    EDIT_MODE_PM: /^\/medlem\/\d+\/meddelanden\/(?:nytt-meddelande|post\/\d+\/(?:redigera|svara))/,
    EDIT_MODE_REPORT: /^\/(forum|marknad|medlem\/\d+\/meddelanden)\/.+\/anmal$/,
    EDIT_MODE_SIGNATURE: /^\/medlem\/\d+\/installningar\/signatur$/,
    SETTINGS: {
        link: "/profil/installningar", // Relying on this path being redirected to the actual settings path allows us to create a link to the preferences page without knowing the user's ID.
        check: /^\/medlem\/\d+\/installningar/, // Should not have a "$" because it should match subpaths too.
    },
    MY_POSTS: "/profil/inlagg",
    SIGNOUT: "/konto/rpc",
    ARTICLE: /^\/artikel\//,
    GUIDE: /^\/guide\//,
    NEWS: /^\/nyhet\//,
    COMPETITION: /^\/tavling\//,
    TEST: /^\/test\//,
    TESTPILOT: /^\/testpilot\//,
    FORUM_CATEGORY: /\/forum\/(\d+)/,
    FORUM: "/forum",
    THREAD: /^\/(?:forum|medlem\/\d+\/meddelanden)\/trad\//,
    POST: /^\/(?:forum|medlem\/\d+\/meddelanden)\/post\//,
    SUCCESSFULLY_SUBMITTED_FORUM_POST: /^\/forum\/post\/\d+$/,
    newPrivateMessage: (sender: number) => `/medlem/${sender}/meddelanden/nytt-meddelande`,
    forumPost: (postID: string) => `/forum/post/${postID}`,
    editPost: (postID: number) => `/forum/post/${postID}/redigera`,
} as const;

export const TAG = {
    b: "b",
    bq: "bq",
    cmd: "cmd",
    code: "code",
    color: "color",
    expander: "expander",
    font: "font",
    h: "h",
    i: "i",
    img: "img",
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
    youtube: "youtube",
} as const;

export const URL_ICONS_GENERAL = "/gfx/spritemap2x.png";
const URL_ICONS_TOOLBAR = "/gfx/toolbar2x.png";
export const ICONS = {
    toolbarIcon: (position: string): string => `<div style="background-image: url('${URL_ICONS_TOOLBAR}'); background-size: 500px auto; background-position: ${position};"></div>`,
    position_toolbar_url: "0 -125px",
    position_toolbar_img: "-50px -125px",
} as const;

export const MOBILE_SITE_DISCLAIMER = {
    sentFrom: `Skickades från`,
    mobileSiteDomain: HOSTNAME_MOBILE,
} as const;

export function getUserID(): unknown {
    const s = (window as any).session;
    return s === undefined ? undefined : s._userid;
}

export function isValidUsername(s: string): boolean {
    // https://www.sweclockers.com/konto/registrera
    // "Namnet kan innehålla 3–32 tecken: bokstäver, siffror, mellanslag samt binde- och understreck."
    // My experiments show that e.g. Å and ß are valid characters, and that the name cannot start or end with " ", "-" or "_".
    // That a username is "valid" does not necessarily mean that it can be used for registering a _new_ account, only that it might be in use by someone.
    // For example, "." is forbidden, but has been allowed earlier: https://www.sweclockers.com/medlem/197838
    // So has '"': https://www.sweclockers.com/medlem/26129
    // Weird Unicode intervals are \u00C0-\u00FF with × and ÷ excluded.
    // Regex matches "Alling ", "Alling-" and "Alling_", so the reverse of the string must also be checked.
    const REGEX_ALMOST_USERNAME = /^(?![ \-_"])[\w\d \-\.\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]{3,32}$/;
    return REGEX_ALMOST_USERNAME.test(s) && REGEX_ALMOST_USERNAME.test(s.split("").reverse().join(""));
}
