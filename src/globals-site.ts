import USERSCRIPT_CONFIG from "../config/userscript";
import { r, escapeRegex } from "./utilities";

export const NAME: string = USERSCRIPT_CONFIG.sitename;
export const HOSTNAME: string = USERSCRIPT_CONFIG.hostname;
export const HOSTNAME_MOBILE: string = `m.` + HOSTNAME;

export const STYLESHEET_URL = "/css/combine.min.css";

export const BANNER_HEIGHT_TOP = `${121}px`; // default height of top ad banner
export const BANNER_HEIGHT_MID = `${360}px`; // default height of page ad modules
export const WRAPPER_WIDTH_WIDE_PX = 1250;
export const WRAPPER_WIDTH_NARROW_PX = 1002;
export const MAX_WIDTH_FOR_NARROW_LAYOUT = `${1100}px`;
export const EXTRA_TAB_MARGIN = `${8}px`;
export const GUTTER_SIZE_PX = 8;
export const OUTSIDER_COLUMN_FIXED_WIDTH_PX = 250;
export const INSIDER_COLUMN_FIXED_WIDTH_PX = 314;
export const PUSH_COLUMN_FIXED_WIDTH_PX = 162;
export const ARTICLE_WIDTH_PX = 516; // (wide viewport; 518 in narrow)
export const CORRECTIONS_DIALOG_WIDTH_PX = 384;
export const FIXED_COLUMNS_TOTAL_WIDTH_NARROW_PX = INSIDER_COLUMN_FIXED_WIDTH_PX + PUSH_COLUMN_FIXED_WIDTH_PX;
export const FIXED_COLUMNS_TOTAL_WIDTH_WIDE_PX = FIXED_COLUMNS_TOTAL_WIDTH_NARROW_PX + OUTSIDER_COLUMN_FIXED_WIDTH_PX;

export const ID = <const> {
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

export const CLASS = <const> {
    fieldset: "s5fieldset",
    button: "button",
    link: "link",
    icon: "icon",
    label: "label",
    inner: "inner",
    menuItem: "menuItem",
    settingsNavigation: "menuItems",
    forumPost: "forumPost",
    forumPostMessage: "message",
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
};

export const PATH = <const> {
    EDIT_MODE_FORUM: /^\/forum\/(.*\/(svara(\?citera)?|redigera)|ny-trad)/,
    EDIT_MODE_MARKET: /^\/marknad\/(.+\/(redigera|kontakt)|ny\-annons)$/,
    EDIT_MODE_MARKET_CONTACT: /^\/marknad\/.+\/kontakt$/,
    EDIT_MODE_PM: /^\/meddelanden\/(.+\/(svara|redigera)|nytt\-meddelande)/,
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
    THREAD: /^\/(?:forum|meddelanden)\/trad\//,
    POST: /^\/(?:forum|meddelanden)\/post\//,
    SUCCESSFULLY_SUBMITTED_FORUM_POST: /^\/forum\/post\/\d+$/,
    newPrivateMessage: (userID: number) => "/pm/nytt-meddelande?rcpts=" + userID,
    editPost: (postID: number) => `/forum/post/${postID}/redigera`,
};

export const TAG = <const> {
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
};

export const URL_ICONS_GENERAL = "/gfx/spritemap2x.png";
const URL_ICONS_TOOLBAR = "/gfx/toolbar2x.png";
export const ICONS = <const> {
    toolbarIcon: (position: string): string => `<div style="background-image: url('${URL_ICONS_TOOLBAR}'); background-size: 500px auto; background-position: ${position};"></div>`,
    position_toolbar_url: "0 -125px",
    position_toolbar_img: "-50px -125px",
};

export const MOBILE_SITE_DISCLAIMER = <const> {
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

export function isValidUsername(s: string): boolean {
    // https://www.sweclockers.com/konto/registrera
    // "Namnet kan innehålla 3–32 tecken: bokstäver, siffror, mellanslag samt binde- och understreck."
    // My experiments show that e.g. Å and ß are valid characters, and that the name cannot start or end with " ", "-" or "_".
    // Weird Unicode intervals are \u00C0-\u00FF with × and ÷ excluded.
    // Regex matches "Alling ", "Alling-" and "Alling_", so the reverse of the string must also be checked.
    const REGEX_ALMOST_USERNAME = /^(?![ \-_])[\w\d \-\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]{3,32}$/;
    return REGEX_ALMOST_USERNAME.test(s) && REGEX_ALMOST_USERNAME.test(s.split("").reverse().join(""));
}
