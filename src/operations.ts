import { DOMCONTENTLOADED } from "userscripter/lib/environment";
import { Operation, operation } from "userscripter/lib/operations";

import * as CONFIG from "~src/config";
import {
    isInEditMode,
    isInEditMode_forum,
    isInEditMode_market,
    isInEditMode_marketContact,
    isInEditMode_PM,
    isOnBSCPreferencesPage,
    isOnSweclockersSettingsPage,
    isReadingEditorialContent,
    isReadingThread,
    mayHaveJustSubmittedForumPost,
    mayHaveJustSubmittedPM,
} from "~src/environment";
import { P, Preferences } from "~src/preferences";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";

import * as autosaveDraft from "./operations/autosave-draft";
import manageCaretPosition from "./operations/caret-position";
import * as DarkTheme from "./operations/dark-theme";
import insertDraftModeToggle from "./operations/draft-mode-toggle";
import insertEditingTools from "./operations/editing-tools";
import insertHeadingToolbarButton from "./operations/heading-toolbar-button";
import adaptCorrectionsLink from "./operations/improved-corrections";
import * as keyboardShortcutsEditMode from "./operations/keyboard-shortcuts/edit-mode";
import insertLinkToTop from "./operations/link-to-top";
import insertMentionEveryoneButton from "./operations/mention-everyone";
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
import enableUndoSupportForBuiltinTools from "./operations/undo-support-builtin-tools";
import insertWebSearchButton from "./operations/web-search-button";

const ALWAYS = true;

// True here means the user wants us to act as if there is undo support (i.e. take no precautions to protect data).
// Chrome always has actual undo support and Firefox never does.
const undoSupport = Preferences.get(P.advanced._.undo_support);

const OPERATIONS: readonly Operation<any>[] = [
    operation({
        description: "set document id",
        condition: () => ALWAYS,
        action: () => { document.documentElement.id = CONFIG.ID.document; },
    }),
    operation({
        description: "insert preferences menu",
        condition: () => isOnBSCPreferencesPage,
        dependencies: { body: "body" }, // Back in 2018, I had problems with document.body being null when logged out and DOMContentLoaded not firing when logged in. Not able to reproduce it in July 2020, but this always works.
        action: insertPreferencesMenu,
    }),
    operation({
        description: "disable scroll restoration",
        condition: () => Preferences.get(P.advanced._.disable_scroll_restoration),
        action: () => {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
        },
    }),
    operation({
        description: "prevent accidental unload (post or message)",
        condition: () => isInEditMode && Preferences.get(P.advanced._.prevent_accidental_unload),
        dependencies: {
            textarea: SELECTOR.textarea,
            _actionButtons: SELECTOR.actionButtons,
        },
        action: preventAccidentalUnload.postOrMessage,
    }),
    operation({
        description: "prevent accidental unload (corrections)",
        condition: () => isReadingEditorialContent && Preferences.get(P.advanced._.prevent_accidental_unload),
        action: preventAccidentalUnload.corrections,
    }),
    operation({
        description: "insert web search button",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_web_search_button),
        dependencies: {
            searchFieldInput: SELECTOR.searchFieldInput,
            searchFieldWrapper: SELECTOR.searchFieldWrapper,
        },
        action: insertWebSearchButton(undoSupport),
    }),
    operation({
        description: "manage caret position in textarea",
        condition: () => isInEditMode, // Should be run unconditionally (see the implementation for more info).
        dependencies: {
            textarea: SELECTOR.textarea,
            // The market doesn't have a dedicated preview button; its save button fills that purpose in this context.
            previewButton: isInEditMode_market ? SELECTOR.saveButton : SELECTOR.previewButton,
        },
        action: manageCaretPosition,
    }),
    operation({
        description: "remove mobile site disclaimer",
        condition: () => isInEditMode_forum && Preferences.get(P.edit_mode._.remove_mobile_site_disclaimer),
        dependencies: { textarea: SELECTOR.textarea },
        action: removeMobileSiteDisclaimer,
    }),
    operation({
        description: "insert editing tools",
        condition: () => isInEditMode && Preferences.get(P.editing_tools._.enable),
        dependencies: { textarea: SELECTOR.textarea },
        action: insertEditingTools(undoSupport),
    }),
    operation({
        description: "insert editing tools in quick reply form",
        condition: () => isReadingThread && Preferences.get(P.editing_tools._.enable) && Preferences.get(P.editing_tools._.in_quick_reply_form),
        dependencies: { textarea: SELECTOR.textarea },
        action: insertEditingTools(undoSupport),
    }),
    operation({
        description: "enable undo support for built-in editing tools",
        condition: () => isInEditMode && Preferences.get(P.advanced._.undo_support),
        dependencies: {
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: enableUndoSupportForBuiltinTools,
    }),
    operation({
        description: "insert heading toolbar button",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.insert_heading_toolbar_button),
        dependencies: {
            textarea: SELECTOR.textarea,
            strikeButton: SELECTOR.textareaToolbarStrikeButton,
        },
        action: insertHeadingToolbarButton(undoSupport),
    }),
    operation({
        description: "insert table toolbar button",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.insert_table_toolbar_button),
        dependencies: {
            textarea: SELECTOR.textarea,
            unorderedListButton: SELECTOR.textareaToolbarUnorderedListButton,
        },
        action: insertTableToolbarButton(undoSupport),
    }),
    operation({
        description: "insert textarea size toggle",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.textarea_size_toggle),
        dependencies: {
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: insertTextareaSizeToggle,
    }),
    operation({
        // Should be inserted before dark theme toggle because they should be in that order.
        description: "insert preferences shortcut",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_preferences_shortcut),
        dependencies: { topMenu: SELECTOR.topMenu },
        action: insertPreferencesShortcut,
    }),
    operation({
        description: "insert dark theme toggle",
        condition: () => !isOnBSCPreferencesPage && Preferences.get(P.dark_theme._.show_toggle),
        dependencies: { topMenu: SELECTOR.topMenu },
        action: DarkTheme.insertToggle,
    }),
    operation({
        description: "prevent accidental signout",
        condition: () => Preferences.get(P.advanced._.prevent_accidental_signout),
        dependencies: { signoutButtonOrSigninSection: SELECTOR.signinSectionOr("#" + SITE.ID.signoutButton ) },
        action: preventAccidentalSignout,
    }),
    operation({
        description: "insert preferences link",
        condition: () => isOnSweclockersSettingsPage,
        dependencies: { settingsNavigation: SELECTOR.settingsNavigation },
        action: insertPreferencesLink,
    }),
    operation({
        description: "insert link to top",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.insert_link_to_top),
        action: insertLinkToTop,
        dependencies: { parent: SELECTOR.listBulkActions },
    }),
    operation({
        description: "insert PM links",
        condition: () => Preferences.get(P.forum_threads._.insert_pm_links),
        action: insertPMLinks,
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "insert quote signature buttons",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.quote_signature_buttons),
        action: insertQuoteSignatureButtons,
        dependencies: { quickReplyForm: SELECTOR.quickReplyForm },
    }),
    operation({
        description: "adapt corrections link to work with improved corrections",
        condition: () => isReadingEditorialContent && Preferences.get(P.general._.improved_corrections),
        dependencies: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: adaptCorrectionsLink,
    }),
    operation({
        description: "enable proofreading",
        condition: () => Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.ALWAYS,
        action: () => {
            // The border must become red before we make it transparent, so we get the nice "flash" effect.
            window.setTimeout(Proofreading.enable, 10);
        },
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "add proofreading listeners",
        condition: () => isReadingEditorialContent && Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.CORRECTIONS,
        dependencies: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: Proofreading.addListeners,
    }),
    operation({
        description: "perform proofreading processing",
        condition: () => isReadingEditorialContent || (isInEditMode && Preferences.get(P.advanced._.proofread_forum_posts)),
        action: Proofreading.performProcessing,
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "replace followed threads link with a link to my posts",
        condition: () => Preferences.get(P.general._.replace_followed_threads_link),
        dependencies: { followedThreadsLinkTextOrSigninSection: SELECTOR.signinSectionOr(SELECTOR.followedThreadsLinkText) },
        action: replaceFollowedThreadsLink,
    }),
    operation({
        description: "remember location in market",
        condition: () => isInEditMode_market && Preferences.get(P.general._.remember_location_in_market),
        dependencies: {
            city: SELECTOR.cityInput,
            region: SELECTOR.regionSelect,
            saveButton: SELECTOR.saveButton,
        },
        action: rememberLocationInMarket,
    }),
    operation({
        description: "insert mention everyone button",
        condition: () => isReadingThread && Preferences.get(P.forum_threads._.mention_everyone_button),
        dependencies: {
            forumPostContainer: SELECTOR.forumPostContainer,
            replyButton: SELECTOR.replyButtonAfterForumPosts,
            quickReplyForm: SELECTOR.quickReplyForm,
        },
        action: insertMentionEveryoneButton,
    }),
    operation({
        description: "insert draft mode toggle",
        condition: () => (isInEditMode_forum || isInEditMode_PM) && Preferences.get(P.edit_mode._.draft_mode_toggle),
        dependencies: {
            saveButton: SELECTOR.saveButton,
            previewButton: SELECTOR.previewButton,
        },
        action: insertDraftModeToggle,
    }),
    operation({
        description: "enable autosave draft watchdog",
        condition: () => (isInEditMode_forum || isInEditMode_PM) && Preferences.get(P.edit_mode._.autosave_draft),
        dependencies: {
            saveButton: SELECTOR.saveButton,
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: autosaveDraft.manageAutosaveWatchdog(undoSupport),
    }),
    operation({
        description: "delete any obsolete autosaved draft",
        condition: () => (mayHaveJustSubmittedForumPost || mayHaveJustSubmittedPM) && Preferences.get(P.edit_mode._.autosave_draft),
        dependencies: { post: SELECTOR.linkedForumPost },
        action: autosaveDraft.clearAutosavedDraftIfObsolete,
    }),
    operation({
        description: "delete any leftover autosaved draft",
        condition: () => false === Preferences.get(P.edit_mode._.autosave_draft),
        action: autosaveDraft.clearAutosavedDraft,
    }),

    // Keyboard shortcuts
    operation({
        description: "perform Mousetrap preparations",
        condition: () => ALWAYS,
        action: performMousetrapPreparations,
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "add edit mode keyboard shortcut (submit)",
        condition: () => isInEditMode && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        dependencies: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButton,
        },
        action: keyboardShortcutsEditMode.submit,
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "add edit mode keyboard shortcut (preview)",
        condition: () => isInEditMode && !isInEditMode_marketContact && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        dependencies: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButton,
        },
        action: keyboardShortcutsEditMode.preview,
        deferUntil: DOMCONTENTLOADED,
    }),
    operation({
        description: "add quick reply keyboard shortcut (submit)",
        condition: () => isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        dependencies: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButtonQuickReply,
        },
        action: keyboardShortcutsEditMode.submit,
    }),
    operation({
        description: "add quick reply keyboard shortcut (preview)",
        condition: () => isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        dependencies: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButtonQuickReply,
        },
        action: keyboardShortcutsEditMode.preview,
    }),
];

export default OPERATIONS;
