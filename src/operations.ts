import {
    DependentOperation,
    IndependentOperation,
    Operation,
} from ".userscripter/lib/operation-manager";

import {
    isInEditMode,
    isInEditMode_forum,
    isInEditMode_market,
    isInEditMode_marketContact,
    isOnBSCPreferencesPage,
    isOnSweclockersSettingsPage,
    isReadingEditorialContent,
    isReadingThread,
    mayHaveJustSubmittedForumPost,
} from "src/environment";
import * as CONFIG from "src/globals-config";
import * as SITE from "src/globals-site";
import P from "src/preferences";
import SELECTOR from "src/selectors";
import { Preferences, isFalse } from "src/userscripter/preference-handling";

import * as autosaveDraft from "./operations/autosave-draft";
import manageCaretPosition from "./operations/caret-position";
import * as DarkTheme from "./operations/dark-theme";
import insertEditingTools from "./operations/editing-tools";
import fixMobileLinks from "./operations/fix-mobile-links";
import insertHeadingToolbarButton from "./operations/heading-toolbar-button";
import adaptCorrectionsLink from "./operations/improved-corrections";
import * as keyboardShortcutsEditMode from "./operations/keyboard-shortcuts/edit-mode";
import insertLinkToTop from "./operations/link-to-top";
import performMousetrapPreparations from "./operations/mousetrap-preparations";
import insertPMLinks from "./operations/pm-links";
import insertPreferencesLink from "./operations/preferences-link";
import insertPreferencesMenu from "./operations/preferences-menu";
import insertPreferencesShortcut from "./operations/preferences-shortcut";
import preventAccidentalSignout from "./operations/prevent-accidental-signout";
import * as preventAccidentalUnload from "./operations/prevent-accidental-unload";
import * as Proofreading from "./operations/proofreading";
import insertQuoteSignatureButtons from "./operations/quote-signature-buttons";
import rememberLocationInMarket from "./operations/remember-location-in-market";
import removeMobileSiteDisclaimer from "./operations/remove-mobile-site-disclaimer";
import replaceFollowedThreadsLink from "./operations/replace-followed-threads-link";
import insertTableToolbarButton from "./operations/table-toolbar-button";
import insertTextareaSizeToggle from "./operations/textarea-size-toggle";
import insertWebSearchButton from "./operations/web-search-button";

const ALWAYS: boolean = true;

const OPERATIONS: readonly Operation[] = [
    new IndependentOperation({
        description: "set document id",
        condition: () => ALWAYS,
        action: () => { document.documentElement.id = CONFIG.ID.document },
    }),
    new IndependentOperation({
        description: "manage dark theme",
        condition: () => ALWAYS,
        action: DarkTheme.manage,
    }),
    // A regular IndependentOperation does not work when the user is logged out, because document.body is null.
    // An IndependentOperation with waitForDOMContentLoaded does not work when the user is logged in, because DOMContentLoaded never fires.
    new DependentOperation({
        description: "insert preferences menu",
        condition: () => isOnBSCPreferencesPage,
        selectors: { body: "body" },
        action: insertPreferencesMenu,
    }),
    new IndependentOperation({
        description: "disable scroll restoration",
        condition: () => Preferences.get(P.advanced._.disable_scroll_restoration),
        action: () => {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
        },
    }),
    new DependentOperation({
        description: "prevent accidental unload (post or message)",
        condition: () => isInEditMode && Preferences.get(P.advanced._.prevent_accidental_unload),
        selectors: {
            textarea: SELECTOR.textarea,
            _actionButtons: SELECTOR.actionButtons,
        },
        action: preventAccidentalUnload.postOrMessage,
    }),
    new IndependentOperation({
        description: "prevent accidental unload (corrections)",
        condition: () => isReadingEditorialContent && Preferences.get(P.advanced._.prevent_accidental_unload),
        action: preventAccidentalUnload.corrections,
    }),
    new DependentOperation({
        description: "insert web search button",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_web_search_button),
        selectors: {
            searchFieldInput: SELECTOR.searchFieldInput,
            searchFieldWrapper: SELECTOR.searchFieldWrapper,
        },
        action: insertWebSearchButton,
    }),
    new DependentOperation({
        description: "manage caret position in textarea",
        condition: () => isInEditMode, // Should be run unconditionally (see the implementation for more info).
        selectors: {
            textarea: SELECTOR.textarea,
            // The market doesn't have a dedicated preview button; its save button fills that purpose in this context.
            previewButton: isInEditMode_market ? SELECTOR.saveButton : SELECTOR.previewButton,
        },
        action: manageCaretPosition,
    }),
    new DependentOperation({
        description: "remove mobile site disclaimer",
        condition: () => isInEditMode_forum && Preferences.get(P.edit_mode._.remove_mobile_site_disclaimer),
        selectors: { textarea: SELECTOR.textarea },
        action: removeMobileSiteDisclaimer,
    }),
    new DependentOperation({
        description: "insert editing tools",
        condition: () => isInEditMode && Preferences.get(P.editing_tools._.enable),
        selectors: { textarea: SELECTOR.textarea },
        action: insertEditingTools,
    }),
    new DependentOperation({
        description: "insert editing tools in quick reply form",
        condition: () => isReadingThread && Preferences.get(P.editing_tools._.enable) && Preferences.get(P.editing_tools._.in_quick_reply_form),
        selectors: { textarea: SELECTOR.textarea },
        action: insertEditingTools,
    }),
    new DependentOperation({
        description: "insert heading toolbar button",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.insert_heading_toolbar_button),
        selectors: {
            textarea: SELECTOR.textarea,
            strikeButton: SELECTOR.textareaToolbarStrikeButton,
        },
        action: insertHeadingToolbarButton,
    }),
    new DependentOperation({
        description: "insert table toolbar button",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.insert_table_toolbar_button),
        selectors: {
            textarea: SELECTOR.textarea,
            unorderedListButton: SELECTOR.textareaToolbarUnorderedListButton,
        },
        action: insertTableToolbarButton,
    }),
    new DependentOperation({
        description: "insert textarea size toggle",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.textarea_size_toggle),
        selectors: {
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: insertTextareaSizeToggle,
    }),
    new DependentOperation({
        // Should be inserted before dark theme toggle because they should be in that order.
        description: "insert preferences shortcut",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_preferences_shortcut),
        selectors: { topMenu: SELECTOR.topMenu },
        action: insertPreferencesShortcut,
    }),
    new DependentOperation({
        description: "insert dark theme toggle",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.dark_theme._.show_toggle),
        selectors: { topMenu: SELECTOR.topMenu },
        action: DarkTheme.insertToggle,
    }),
    new DependentOperation({
        description: "prevent accidental signout",
        condition: () => Preferences.get(P.advanced._.prevent_accidental_signout),
        selectors: { signoutButtonOrSigninSection: SELECTOR.signinSectionOr("#" + SITE.ID.signoutButton ) },
        action: preventAccidentalSignout,
    }),
    new DependentOperation({
        description: "insert preferences link",
        condition: () => isOnSweclockersSettingsPage,
        selectors: { settingsNavigation: SELECTOR.settingsNavigation },
        action: insertPreferencesLink,
    }),
    new DependentOperation({
        description: "insert link to top",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.insert_link_to_top),
        action: insertLinkToTop,
        selectors: { parent: SELECTOR.listBulkActions },
    }),
    new IndependentOperation({
        description: "insert PM links",
        condition: () => Preferences.get(P.forum_threads._.insert_pm_links),
        action: insertPMLinks,
        waitForDOMContentLoaded: true,
    }),
    new IndependentOperation({
        description: "fix mobile links",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.fix_mobile_links),
        action: fixMobileLinks,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "insert quote signature buttons",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.quote_signature_buttons),
        action: insertQuoteSignatureButtons,
        selectors: { quickReplyForm: SELECTOR.quickReplyForm },
    }),
    new DependentOperation({
        description: "adapt corrections link to work with improved corrections",
        condition: () => isReadingEditorialContent && Preferences.get(P.general._.improved_corrections),
        selectors: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: adaptCorrectionsLink,
    }),
    new IndependentOperation({
        description: "enable proofreading",
        condition: () => Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.ALWAYS,
        action: () => {
            // The border must become red before we make it transparent, so we get the nice "flash" effect.
            window.setTimeout(Proofreading.enable, 10);
        },
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add proofreading listeners",
        condition: () => isReadingEditorialContent && Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.CORRECTIONS,
        selectors: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: Proofreading.addListeners,
    }),
    new IndependentOperation({
        description: "perform proofreading processing",
        condition: () => isReadingEditorialContent || (isInEditMode && Preferences.get(P.advanced._.proofread_forum_posts)),
        action: Proofreading.performProcessing,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "replace followed threads link with a link to my posts",
        condition: () => isInEditMode_market && Preferences.get(P.general._.replace_followed_threads_link),
        selectors: { followedThreadsLinkTextOrSigninSection: SELECTOR.signinSectionOr(SELECTOR.followedThreadsLinkText) },
        action: replaceFollowedThreadsLink,
    }),
    new DependentOperation({
        description: "remember location in market",
        condition: () => Preferences.get(P.general._.remember_location_in_market),
        selectors: {
          city: SELECTOR.cityInput,
          region: SELECTOR.regionSelect,
          saveButton: SELECTOR.saveButton,
        },
        action: rememberLocationInMarket,
    }),
    new DependentOperation({
        description: "enable autosave draft watchdog",
        condition: () => isInEditMode_forum && Preferences.get(P.edit_mode._.autosave_draft),
        selectors: {
            saveButton: SELECTOR.saveButton,
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: autosaveDraft.manageAutosaveWatchdog,
    }),
    new DependentOperation({
        description: "delete any obsolete autosaved draft",
        condition: () => mayHaveJustSubmittedForumPost && Preferences.get(P.edit_mode._.autosave_draft),
        selectors: { post: SELECTOR.linkedForumPost },
        action: autosaveDraft.clearAutosavedDraftIfObsolete,
    }),
    new IndependentOperation({
        description: "delete any leftover autosaved draft",
        condition: () => isFalse(Preferences.get(P.edit_mode._.autosave_draft)),
        action: autosaveDraft.clearAutosavedDraft,
    }),

    // Keyboard shortcuts
    new IndependentOperation({
        description: "perform Mousetrap preparations",
        condition: () => ALWAYS,
        action: performMousetrapPreparations,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add edit mode keyboard shortcut (submit)",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        selectors: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButton,
        },
        action: keyboardShortcutsEditMode.submit,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add edit mode keyboard shortcut (preview)",
        condition: () => isInEditMode && !isInEditMode_marketContact && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        selectors: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButton,
        },
        action: keyboardShortcutsEditMode.preview,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add quick reply keyboard shortcut (submit)",
        condition: () => isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        selectors: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButtonQuickReply,
        },
        action: keyboardShortcutsEditMode.submit,
    }),
    new DependentOperation({
        description: "add quick reply keyboard shortcut (preview)",
        condition: () => isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        selectors: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButtonQuickReply,
        },
        action: keyboardShortcutsEditMode.preview,
    }),
];

export default OPERATIONS;
