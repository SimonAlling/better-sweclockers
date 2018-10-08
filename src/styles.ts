import { StylesheetModule } from "lib/stylesheet-manager";
import { Preferences, isFalse } from "userscripter/preference-handling";
import P from "preferences";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "selectors";
import { isOnBSCPreferencesPage } from "./environment";
import { hideById, hideByClass, hideBySelector } from "./styles/hide";
import filterNewInForum from "./styles/interests-new-in-forum";

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
        condition: Preferences.get(P.forum_threads._.improved_pagination_buttons),
        css: require("styles/improved-pagination-buttons"),
    },
    {
        condition: Preferences.get(P.general._.improved_corrections),
        css: require("styles/improved-corrections"),
    },
    {
        condition: Preferences.get(P.forum_threads._.highlight_own_posts),
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
    {
        condition: ALWAYS,
        css: filterNewInForum(Preferences.get(P.interests._.uninteresting_subforums)),
    },

    // Customize content:
    {
        condition: isFalse(Preferences.get(P.customize_content._.carousel)),
        css: hideById(SITE.ID.carousel),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.social_media)),
        css: hideByClass(SITE.CLASS.socialMediaButtons),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.guides)),
        css: hideBySelector(SELECTOR.sideColumnGuides),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.popular_galleries)),
        css: hideBySelector(SELECTOR.sideColumnPopularGalleries),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_in_forum_side)),
        css: hideById(SITE.ID.newInForumWidget_side),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_in_market)),
        css: hideById(SITE.ID.newInMarketWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_in_test_lab)),
        css: hideById(SITE.ID.newInTestLabWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.popular_at_prisjakt)),
        css: hideById(SITE.ID.popularAtPrisjaktWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_tech_jobs)),
        css: hideById(SITE.ID.newTechJobsWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.external_news)),
        css: hideById(SITE.ID.externalNewsWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.latest_news)),
        css: hideById(SITE.ID.latestNewsWidget),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.new_in_forum_main)),
        css: hideById(SITE.ID.newInForumWidget_main),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.footer)),
        css: require("styles/hide-footer"),
    },
];

export default STYLESHEET_MODULES;
