import USERSCRIPT_CONFIG from "../config/userscript";
import { r, escapeRegex } from "./utilities";

export const NAME: string = USERSCRIPT_CONFIG.sitename;
export const HOSTNAME: string = USERSCRIPT_CONFIG.hostname;
export const HOSTNAME_MOBILE: string = `m.` + HOSTNAME;

export const STYLESHEET_URL = "/css/combine.min.css";

export const BANNER_HEIGHT_TOP = `${121}px`; // default height of top ad banner
export const BANNER_HEIGHT_MID = `${360}px`; // default height of page ad modules
export const WRAPPER_WIDTH_WIDE = `${1250}px`;
export const WRAPPER_WIDTH_NARROW = `${1002}px`;
export const MAX_WIDTH_FOR_NARROW_LAYOUT = `${1100}px`;
export const EXTRA_TAB_MARGIN = `${8}px`;

export const ID = {
    siteHeader: "siteHeader",
    signoutButton: "signoutForm",
    textarea: "__laika_cnt.textarea.0",
    newsTicker: "newsticker",
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
};

export const CLASS = {
    fieldset: "s5fieldset",
    button: "button",
    link: "link",
    icon: "icon",
    label: "label",
    menu: "menu",
    inner: "inner",
    menuItem: "menuItem",
    settingsNavigation: "menuItems",
    forumPost: "forumPost",
    forumPostMessage: "message",
    forumPostProfileDetails: "details",
    forumPostSignature: "signature",
    forumPostControls: "controls",
    forumPostBtnGroup: "btnGroup",
    isReader: "isReader",
    bbImage: "bbImage",
    imgControls: "imgControls",
    errorDialog: "errorDialog",
    proofDialog: "proofDialog",
    socialMediaButtons: [ `threadShare`, `greyContentShare`, `sideShare` ],
    sideBox: "sideBox",
    subforumLink: "link",
    toolbarGroup: "tbGroup",
    toolbarButton: "tbButton iconButton noselect",
    toolbarButtonIcon: "btnIcon",
    toolbarHeadingButton: "header",
};

export const PATH = {
    EDIT_MODE_FORUM: /^\/forum\/(.*\/(svara(\?citera)?|redigera)|ny-trad)/,
    EDIT_MODE_MARKET: /^\/marknad\/(.+\/redigera|ny\-annons)$/,
    EDIT_MODE_PM: /^\/pm\/(.+\/(svara|redigera)|nytt\-meddelande)/,
    EDIT_MODE_REPORT: /^\/(forum|marknad|pm)\/.+\/anmal$/,
    SETTINGS: "/profil/installningar",
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
    FORUM_THREAD: /^\/forum\/trad\//,
    FORUM_POST: /^\/forum\/post\//,
    newPrivateMessage: (userID: number) => "/pm/nytt-meddelande?rcpts=" + userID,
};

export const TAG = {
    b: "b",
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
};

export const URL_ICONS_GENERAL = "/gfx/spritemap2x.png";
const URL_ICONS_TOOLBAR = "/gfx/toolbar2x.png";
export const ICONS = {
    toolbarIcon: (position: string): string => `<div style="background-image: url('${URL_ICONS_TOOLBAR}'); background-size: 500px auto; background-position: ${position};"></div>`,
    position_toolbar_url: "0 -125px",
    position_toolbar_img: "-50px -125px",
};

export const MOBILE_SITE_DISCLAIMER = {
    sentFrom: `Skickades från`,
    mobileSiteDomain: HOSTNAME_MOBILE,
};

export const REGEX_MOBILE_SITE_DISCLAIMER = new RegExp([
    r`\n+.*`, // line breaks and presentation start tag(s)
    MOBILE_SITE_DISCLAIMER.sentFrom,
    r`.*`, // space and [url=...]
    escapeRegex(MOBILE_SITE_DISCLAIMER.mobileSiteDomain),
    r`.*$`, // [/url] and presentation end tag(s)
].join(""), "mg");

export const REGEX_MOBILE_LINK = new RegExp([
    r`^(https?:\/\/)`,
    escapeRegex(HOSTNAME_MOBILE),
].join(""), "i");
