import * as CONFIG from "./config";
import * as SITE from "./site";

// NOTE: Be careful with document.head here, as it may be null at the time of
// userscript execution (e.g. in a background tab in Firefox)!

export const isOnBSCPreferencesPage = pathMatches(CONFIG.PATH.PREFERENCES.check(SITE.PATH.SETTINGS.check));

export const isOnSweclockersSettingsPage = pathMatches(SITE.PATH.SETTINGS.check) && !isOnBSCPreferencesPage;
export const isOnSomeProfilePage = pathMatches(SITE.PATH.PROFILE("\\d+"));

function pathMatches(r: RegExp): boolean {
    return r.test(document.location.pathname);
}

export const isInForumThreadsView = pathMatches(SITE.PATH.FORUM_THREADS_VIEW);
export const isInEditMode_forum = pathMatches(SITE.PATH.EDIT_MODE_FORUM);
export const isInEditMode_market = pathMatches(SITE.PATH.EDIT_MODE_MARKET);
export const isInEditMode_marketContact = pathMatches(SITE.PATH.EDIT_MODE_MARKET_CONTACT);
export const isInEditMode_PM = pathMatches(SITE.PATH.EDIT_MODE_PM);
export const isInEditMode_report = pathMatches(SITE.PATH.EDIT_MODE_REPORT);
export const isInEditMode_signature = pathMatches(SITE.PATH.EDIT_MODE_SIGNATURE);
export const mayHaveJustSubmittedForumPost = pathMatches(SITE.PATH.SUCCESSFULLY_SUBMITTED_FORUM_POST);
export const mayHaveJustSubmittedPM = pathMatches(SITE.PATH.SUCCESSFULLY_SUBMITTED_PM);

export const isInEditMode = [
    isInEditMode_forum,
    isInEditMode_market,
    isInEditMode_PM,
    isInEditMode_report,
    isInEditMode_signature,
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
