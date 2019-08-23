import * as CONFIG from "./globals-config";
import * as SITE from "./globals-site";

export const isLoggedIn = (document.head.textContent as string).includes(`'visitorType': 'member'`);

export const isOnBSCPreferencesPage = CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS) === document.location.pathname;

export const isOnSweclockersSettingsPage = document.location.pathname.startsWith(SITE.PATH.SETTINGS) && !isOnBSCPreferencesPage;

function pathMatches(r: RegExp): boolean {
    return r.test(document.location.pathname);
}

export const isInEditMode_forum = pathMatches(SITE.PATH.EDIT_MODE_FORUM);
export const isInEditMode_market = pathMatches(SITE.PATH.EDIT_MODE_MARKET);
export const isInEditMode_marketContact = pathMatches(SITE.PATH.EDIT_MODE_MARKET_CONTACT);
export const isInEditMode_PM = pathMatches(SITE.PATH.EDIT_MODE_PM);
export const isInEditMode_report = pathMatches(SITE.PATH.EDIT_MODE_REPORT);

export const isInEditMode = [
    isInEditMode_forum,
    isInEditMode_market,
    isInEditMode_PM,
    isInEditMode_report,
].some(x => x);

export const isReadingEditorialContent = [
    SITE.PATH.ARTICLE,
    SITE.PATH.GUIDE,
    SITE.PATH.NEWS,
    SITE.PATH.COMPETITION,
    SITE.PATH.TEST,
    SITE.PATH.TESTPILOT,
].some(pathMatches);

export const isReadingThread = !isInEditMode && [
    SITE.PATH.THREAD,
    SITE.PATH.POST,
].some(pathMatches);
