import * as CONFIG from "./globals-config";
import * as SITE from "./globals-site";

export function isOnBSCPreferencesPage(): boolean {
    return CONFIG.PATH.PREFERENCES(SITE.PATH.SETTINGS) === document.location.pathname;
}

export function isOnSweclockersSettingsPage(): boolean {
    return SITE.PATH.SETTINGS === document.location.pathname;
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

export function isInEditMode(): boolean {
    return [
        isInEditMode_forum,
        isInEditMode_market,
        isInEditMode_PM,
    ].some(f => f());
}
