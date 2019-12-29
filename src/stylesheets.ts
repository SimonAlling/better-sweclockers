import { STYLE_PROOFREADING } from "@alling/better-sweclockers-lib";
import * as ms from "milliseconds";

import { Stylesheets, stylesheet } from "userscripter/lib/stylesheets";
import { ALWAYS } from "userscripter/lib/environment";

import { isInEditMode, isOnBSCPreferencesPage, isOnSweclockersSettingsPage, isReadingThread } from "~src/environment";
import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import P from "~src/preferences";
import SELECTOR from "~src/selectors";
import { hideByClass, hideById, hideBySelector } from "~src/stylesheets/hide";
import filterNewInForum from "~src/stylesheets/interests-new-in-forum";
import threadStatusTooltips from "~src/stylesheets/thread-status-tooltips-logic";
import { timeIsWithin } from "~src/time"
import { Preferences } from "~src/preferences";

function isTimeForMaintenance() {
    const start = ms.hours(4) + ms.minutes(30);
    const end   = ms.hours(5) + ms.minutes(10);
    return timeIsWithin({ start, end })(new Date());
}

const STYLESHEETS = {
    stylesheet: stylesheet({
        condition: ALWAYS,
        css: require("./stylesheets/stylesheet"),
    }),
    dark_theme_toggle: stylesheet({
        condition: ALWAYS,
        css: require("./stylesheets/dark-theme-toggle"),
    }),
    doge: stylesheet({
        condition: ALWAYS,
        css: require("./stylesheets/doge"),
    }),
    preferences_link: stylesheet({
        condition: _ => isOnSweclockersSettingsPage,
        css: require("./stylesheets/preferences-link"),
    }),
    preferences: stylesheet({
        condition: _ => isOnBSCPreferencesPage,
        css: require("./stylesheets/preferences"),
    }),
    lock_heights: stylesheet({
        condition: () => Preferences.get(P.general._.lock_heights),
        css: require("./stylesheets/lock-heights"),
    }),
    compact_layout: stylesheet({
        condition: () => Preferences.get(P.general._.compact_layout),
        css: require("./stylesheets/compact-layout"),
    }),
    adaptive_width: stylesheet({
        condition: () => Preferences.get(P.general._.adaptive_width),
        css: require("./stylesheets/adaptive-width"),
    }),
    improved_pagination_buttons: stylesheet({
        condition: () => Preferences.get(P.forum_threads._.improved_pagination_buttons),
        css: require("./stylesheets/improved-pagination-buttons"),
    }),
    improved_corrections: stylesheet({
        condition: () => Preferences.get(P.general._.improved_corrections),
        css: require("./stylesheets/improved-corrections"),
    }),
    adaptive_width_corrections: stylesheet({
        condition: () => Preferences.get(P.general._.improved_corrections) && Preferences.get(P.general._.adaptive_width),
        css: require("./stylesheets/adaptive-width-corrections"),
    }),
    web_search_button: stylesheet({
        condition: () => Preferences.get(P.general._.insert_web_search_button),
        css: require("./stylesheets/web-search-button"),
    }),
    highlight_own_posts: stylesheet({
        condition: () => Preferences.get(P.forum_threads._.highlight_own_posts),
        css: require("./stylesheets/highlight-own-posts"),
    }),
    editing_tools: stylesheet({
        condition: ALWAYS,
        css: require("./stylesheets/editing-tools"),
    }),
    textarea_size_toggle: stylesheet({
        condition: ALWAYS,
        css: require("./stylesheets/textarea-size-toggle"),
    }),
    monospace_font: stylesheet({
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.monospace_font),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { font-family: monospace; }`,
    }),
    monospace_font_in_quick_reply_form: stylesheet({
        condition: () => isReadingThread && Preferences.get(P.edit_mode._.monospace_font_in_quick_reply_form),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { font-family: monospace; }`,
    }),
    textarea_size_toggle_textarea_height: stylesheet({
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.textarea_size_toggle),
        css: `#${CONFIG.ID.document} ${SELECTOR.textarea} { height: ${Preferences.get(P.edit_mode._.textarea_size)}px; }`,
    }),
    autosave_draft: stylesheet({
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.autosave_draft),
        css: require("./stylesheets/autosave-draft"),
    }),
    improved_image_controls: stylesheet({
        condition: () => Preferences.get(P.advanced._.improved_image_controls),
        css: require("./stylesheets/improved-image-controls"),
    }),
    uninteresting_subforums: stylesheet({
        condition: ALWAYS,
        css: filterNewInForum(Preferences.get(P.interests._.uninteresting_subforums)),
    }),
    replace_followed_threads_link: stylesheet({
        condition: () => Preferences.get(P.general._.replace_followed_threads_link),
        css: require("./stylesheets/replace-followed-threads-link"),
    }),
    proofread_forum_posts: stylesheet({
        condition: () => isInEditMode && Preferences.get(P.advanced._.proofread_forum_posts),
        css: STYLE_PROOFREADING,
        id: "proofread_forum_posts",
    }),
    down_for_maintenance: stylesheet({
        condition: () => !isOnBSCPreferencesPage && isTimeForMaintenance() && Preferences.get(P.advanced._.down_for_maintenance),
        css: require("./stylesheets/down-for-maintenance"),
    }),
    custom_css: stylesheet({
        condition: () => Preferences.get(P.advanced._.custom_css_enable),
        css: Preferences.get(P.advanced._.custom_css_code),
    }),
    thread_status_tooltips: stylesheet({
        condition: () => Preferences.get(P.general._.thread_status_tooltips),
        css: require("./stylesheets/thread-status-tooltips"),
    }),
    thread_status_tooltips_generated: stylesheet({
        condition: () => Preferences.get(P.general._.thread_status_tooltips),
        css: threadStatusTooltips(),
    }),
    mention_everyone: stylesheet({
        condition: () => Preferences.get(P.forum_threads._.mention_everyone_button),
        css: require("./stylesheets/mention-everyone"),
    }),

    // Customize content:
    customize_content_news_ticker: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.news_ticker),
        css: hideById(SITE.ID.newsTicker),
    }),
    customize_content_carousel: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.carousel),
        css: hideById(SITE.ID.carousel),
    }),
    customize_content_social_media: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.social_media),
        css: hideByClass(SITE.CLASS.socialMediaButtons),
    }),
    customize_content_anniversary: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.anniversary),
        css: hideBySelector(SELECTOR.sideColumnAnniversary),
    }),
    customize_content_guides: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.guides),
        css: hideBySelector(SELECTOR.sideColumnGuides),
    }),
    customize_content_popular_galleries: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.popular_galleries),
        css: hideBySelector(SELECTOR.sideColumnPopularGalleries),
    }),
    customize_content_new_in_forum_side: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.new_in_forum_side),
        css: hideById(SITE.ID.newInForumWidget_side),
    }),
    customize_content_new_in_market: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.new_in_market),
        css: hideById(SITE.ID.newInMarketWidget),
    }),
    customize_content_new_in_test_lab: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.new_in_test_lab),
        css: hideById(SITE.ID.newInTestLabWidget),
    }),
    customize_content_in_the_store: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.in_the_store),
        css: hideById(SITE.ID.inTheStoreWidget),
    }),
    customize_content_popular_at_prisjakt: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.popular_at_prisjakt),
        css: hideById(SITE.ID.popularAtPrisjaktWidget),
    }),
    customize_content_new_tech_jobs: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.new_tech_jobs),
        css: hideById(SITE.ID.newTechJobsWidget),
    }),
    customize_content_external_news: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.external_news),
        css: hideById(SITE.ID.externalNewsWidget),
    }),
    customize_content_more_articles: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.more_articles),
        css: hideBySelector(SELECTOR.moreArticles),
    }),
    customize_content_latest_news: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.latest_news),
        css: hideById(SITE.ID.latestNewsWidget),
    }),
    customize_content_new_in_forum_main: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.new_in_forum_main),
        css: hideById(SITE.ID.newInForumWidget_main),
    }),
    customize_content_footer: stylesheet({
        condition: () => false === Preferences.get(P.customize_content._.footer),
        css: require("./stylesheets/hide-footer"),
    }),
} as const;

// This trick uncovers type errors in STYLESHEETS while retaining the static knowledge of its properties (so we can still write e.g. STYLESHEETS.foo):
const _: Stylesheets = STYLESHEETS; void _;

export default STYLESHEETS;
