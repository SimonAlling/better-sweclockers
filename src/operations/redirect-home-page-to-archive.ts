import * as SITE from "~src/site";

export default (e: {
    headerLogoLink: HTMLElement,
    latestNewsWidgetLink: HTMLElement,
    footerLogoLink: HTMLElement,
}) => {
    if (document.location.pathname === "/") {
        document.location.pathname = SITE.PATH.ARCHIVE;
    } else {
        // Yes, this is repetitive. Yes, `Object.values` exists. But no, Userscripter (as of version 2.0.0) creates `e` with `Object.defineProperty` without the `enumerable` flag enabled, so `Object.values` returns the empty array.
        (e.headerLogoLink as HTMLAnchorElement).href = SITE.PATH.ARCHIVE;
        (e.latestNewsWidgetLink as HTMLAnchorElement).href = SITE.PATH.ARCHIVE;
        (e.footerLogoLink as HTMLAnchorElement).href = SITE.PATH.ARCHIVE;
    }
};
