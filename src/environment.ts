import * as CONFIG from "./globals-config";
import * as SITE from "./globals-site";

// NOTE: Be careful with document.head here, as it may be null at the time of
// userscript execution (e.g. in a background tab in Firefox)!

export const isOnBSCPreferencesPage = pathMatches(CONFIG.PATH.PREFERENCES.check(SITE.PATH.SETTINGS.check));

export const isOnSweclockersSettingsPage = pathMatches(SITE.PATH.SETTINGS.check) && !isOnBSCPreferencesPage;

function pathMatches(r: RegExp): boolean {
    return r.test(document.location.pathname);
}

export const isInEditMode_forum = pathMatches(SITE.PATH.EDIT_MODE_FORUM);
export const isInEditMode_market = pathMatches(SITE.PATH.EDIT_MODE_MARKET);
export const isInEditMode_marketContact = pathMatches(SITE.PATH.EDIT_MODE_MARKET_CONTACT);
export const isInEditMode_PM = pathMatches(SITE.PATH.EDIT_MODE_PM);
export const isInEditMode_report = pathMatches(SITE.PATH.EDIT_MODE_REPORT);
export const mayHaveJustSubmittedForumPost = pathMatches(SITE.PATH.SUCCESSFULLY_SUBMITTED_FORUM_POST);

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
