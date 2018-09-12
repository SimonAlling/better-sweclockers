import { StylesheetModule } from "lib/stylesheet-manager";
import { Preferences, isFalse } from "userscripter/preference-handling";
import P from "preferences";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import { isOnBSCPreferencesPage } from "./environment";

const ALWAYS: boolean = true;

/*
******** README ********

CSS modules to be inserted conditionally are declared in this file.

In practice, "conditionally" could mean e.g. that a certain preference is set. ALWAYS can also be used as a condition.

Every item must be an object with the following structure:
{
    condition : a boolean indicating whether this module should be inserted
    css       : the CSS code to insert
}
*/

const STYLESHEET_MODULES: ReadonlyArray<StylesheetModule> = [
    {
        condition: ALWAYS,
        css: require("styles/stylesheet"),
    },
    {
        condition: ALWAYS,
        css: require("styles/dark-theme-toggle"),
    },
    {
        condition: ALWAYS,
        css: require("styles/doge"),
    },
    {
        condition: isOnBSCPreferencesPage(),
        css: require("styles/preferences"),
    },
    {
        condition: Preferences.get(P.general._.lock_heights),
        css: require("styles/lock-heights"),
    },
    {
        condition: Preferences.get(P.general._.compact_layout),
        css: require("styles/compact-layout"),
    },
    {
        condition: Preferences.get(P.general._.improved_pagination_buttons),
        css: require("styles/improved-pagination-buttons"),
    },
    {
        condition: Preferences.get(P.general._.improved_corrections),
        css: require("styles/improved-corrections"),
    },
    {
        condition: Preferences.get(P.general._.highlight_own_posts),
        css: require("styles/highlight-own-posts"),
    },
    {
        condition: ALWAYS,
        css: require("styles/editing-tools"),
    },
    {
        condition: Preferences.get(P.advanced._.improved_image_controls),
        css: require("styles/improved-image-controls"),
    },

    // Customize content:
    {
        condition: isFalse(Preferences.get(P.customize_content._.carousel)),
        css: require("styles/hide-carousel"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.social_media)),
        css: require("styles/hide-social-media"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.latest_news)),
        css: require("styles/hide-widget-latest-news"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_in_forum)),
        css: require("styles/hide-widget-new-in-forum"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.popular_at_prisjakt)),
        css: require("styles/hide-widget-popular-at-prisjakt"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_tech_jobs)),
        css: require("styles/hide-widget-new-tech-jobs"),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.external_news)),
        css: require("styles/hide-widget-external-news"),
    },
];

export default STYLESHEET_MODULES;
