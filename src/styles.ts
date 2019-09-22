import { STYLE_PROOFREADING } from "@alling/better-sweclockers-lib";
import { StylesheetModule } from "lib/stylesheet-manager";
import { Preferences, isFalse } from "userscripter/preference-handling";
import P from "preferences";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "selectors";
import { isOnBSCPreferencesPage, isInEditMode, isReadingThread } from "./environment";
import { hideById, hideByClass, hideBySelector } from "./styles/hide";
import { timeIsWithin } from "./time"
import * as ms from "milliseconds";
import filterNewInForum from "./styles/interests-new-in-forum";

const ALWAYS: boolean = true;

function isTimeForMaintenance() {
    const start = ms.hours(4) + ms.minutes(30);
    const end   = ms.hours(5) + ms.minutes(10);
    return timeIsWithin({ start, end })(new Date());
}

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
        condition: isOnBSCPreferencesPage,
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
        condition: Preferences.get(P.general._.adaptive_width),
        css: require("styles/adaptive-width"),
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
        condition: Preferences.get(P.general._.improved_corrections) && Preferences.get(P.general._.adaptive_width),
        css: require("styles/adaptive-width-corrections"),
    },
    {
        condition: Preferences.get(P.general._.insert_web_search_button),
        css: require("styles/web-search-button"),
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
        condition: ALWAYS,
        css: require("styles/textarea-size-toggle"),
    },
    {
        condition: isInEditMode && Preferences.get(P.edit_mode._.monospace_font),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { font-family: monospace; }`,
    },
    {
        condition: isReadingThread && Preferences.get(P.edit_mode._.monospace_font_in_quick_reply_form),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { font-family: monospace; }`,
    },
    {
        condition: isInEditMode && Preferences.get(P.edit_mode._.textarea_size_toggle),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { height: ${Preferences.get(P.edit_mode._.textarea_size)}px; }`,
    },
    {
        condition: isInEditMode && Preferences.get(P.edit_mode._.autosave_draft),
        css: require("styles/autosave-draft"),
    },
    {
        condition: Preferences.get(P.advanced._.improved_image_controls),
        css: require("styles/improved-image-controls"),
    },
    {
        condition: ALWAYS,
        css: filterNewInForum(Preferences.get(P.interests._.uninteresting_subforums)),
    },
    {
        condition: Preferences.get(P.general._.replace_followed_threads_link),
        css: require("styles/replace-followed-threads-link"),
    },
    {
        condition: isInEditMode && Preferences.get(P.advanced._.proofread_forum_posts),
        css: STYLE_PROOFREADING,
    },
    {
        condition: !isOnBSCPreferencesPage && isTimeForMaintenance() && Preferences.get(P.advanced._.down_for_maintenance),
        css: require("styles/down-for-maintenance"),
    },
    {
        condition: Preferences.get(P.advanced._.custom_css_enable),
        css: Preferences.get(P.advanced._.custom_css_code),
    },

    // Customize content:
    {
        condition: isFalse(Preferences.get(P.customize_content._.news_ticker)),
        css: hideById(SITE.ID.newsTicker),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.carousel)),
        css: hideById(SITE.ID.carousel),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.social_media)),
        css: hideByClass(SITE.CLASS.socialMediaButtons),
    },
    {
        condition: isFalse(Preferences.get(P.customize_content._.anniversary)),
        css: hideBySelector(SELECTOR.sideColumnAnniversary),
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
        condition: isFalse(Preferences.get(P.customize_content._.in_the_store)),
        css: hideById(SITE.ID.inTheStoreWidget),
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
        condition: isFalse(Preferences.get(P.customize_content._.more_articles)),
        css: hideBySelector(SELECTOR.moreArticles),
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
