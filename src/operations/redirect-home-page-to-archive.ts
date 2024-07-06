import * as SITE from "~src/site";

export default (e: {
    headerLogoLink: HTMLElement,
    latestNewsWidgetLink: HTMLElement,
    footerLogoLink: HTMLElement,
}) => {
    if (document.location.pathname === "/") {
        document.location.pathname = SITE.PATH.ARCHIVE;
    } else {
        for (const link of Object.values(e)) {
            (link as HTMLAnchorElement).href = SITE.PATH.ARCHIVE;
        }
    }
};
