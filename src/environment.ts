import * as CONFIG from "./globals-config";
import * as SITE from "./globals-site";

export function isLoggedIn(): boolean {
    return (document.head.textContent as string).includes(`'visitorType': 'member'`);
}

export function isOnBSCPreferencesPage(): boolean {
    return CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS) === document.location.pathname;
}

export function isOnSweclockersSettingsPage(): boolean {
    return document.location.pathname.startsWith(SITE.PATH.SETTINGS) && !isOnBSCPreferencesPage();
}

export function isInEditMode_forum(): boolean {
    return SITE.PATH.EDIT_MODE_FORUM.test(document.location.pathname);
}

export function isInEditMode_market(): boolean {
    return SITE.PATH.EDIT_MODE_MARKET.test(document.location.pathname);
}

export function isInEditMode_PM(): boolean {
    return SITE.PATH.EDIT_MODE_PM.test(document.location.pathname);
}

export function isInEditMode_report(): boolean {
    return SITE.PATH.EDIT_MODE_REPORT.test(document.location.pathname);
}

export function isInEditMode(): boolean {
    return [
        isInEditMode_forum,
        isInEditMode_market,
        isInEditMode_PM,
        isInEditMode_report,
    ].some(f => f());
}

export function isReadingEditorialContent(): boolean {
    return [
        SITE.PATH.ARTICLE,
        SITE.PATH.GUIDE,
        SITE.PATH.NEWS,
        SITE.PATH.COMPETITION,
        SITE.PATH.TEST,
        SITE.PATH.TESTPILOT,
    ].some(r => r.test(document.location.pathname));
}

export function isReadingForumThread(): boolean {;
    return !isInEditMode() && [
        SITE.PATH.FORUM_THREAD,
        SITE.PATH.FORUM_POST,
    ].some(r => r.test(document.location.pathname));
}
