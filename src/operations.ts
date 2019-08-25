import { Operation, DependentOperation, IndependentOperation, SUCCESS, FAILURE } from "lib/operation-manager";
import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import SELECTOR from "./selectors";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import {
    isLoggedIn,
    isInEditMode,
    isInEditMode_market,
    isInEditMode_marketContact,
    isInEditMode_forum,
    isOnBSCPreferencesPage,
    isOnSweclockersSettingsPage,
    isReadingEditorialContent,
    isReadingThread,
} from "./environment";
import INSERT_PREFERENCES_MENU from "./operations/insert-preferences-menu";
import INSERT_PREFERENCES_LINK from "./operations/insert-preferences-link";
import INSERT_PREFERENCES_SHORTCUT from "./operations/insert-preferences-shortcut";
import INSERT_WEB_SEARCH_BUTTON from "./operations/insert-web-search-button";
import INSERT_EDITING_TOOLS from "./operations/insert-editing-tools";
import INSERT_HEADING_TOOLBAR_BUTTON from "./operations/insert-heading-toolbar-button";
import INSERT_TEXTAREA_SIZE_TOGGLE from "./operations/insert-textarea-size-toggle";
import INSERT_LINK_TO_TOP from "./operations/insert-link-to-top";
import INSERT_PM_LINKS from "./operations/insert-pm-links";
import FIX_MOBILE_LINKS from "./operations/fix-mobile-links";
import INSERT_QUOTE_SIGNATURE_BUTTONS from "./operations/insert-quote-signature-buttons";
import PREVENT_ACCIDENTAL_SIGNOUT from "./operations/prevent-accidental-signout";
import * as PREVENT_ACCIDENTAL_UNLOAD from "./operations/prevent-accidental-unload";
import ADAPT_CORRECTIONS_LINK from "./operations/adapt-corrections-link";
import REPLACE_FOLLOWED_THREADS_LINK from "./operations/replace-followed-threads-link";
import MANAGE_CARET_POSITION from "./operations/manage-caret-position";
import REMOVE_MOBILE_SITE_DISCLAIMER from "./operations/remove-mobile-site-disclaimer";
import * as KEYBOARD_SHORTCUTS_EDIT_MODE from "./operations/keyboard-shortcuts/edit-mode";
import MOUSETRAP_PREPARATIONS from "./operations/mousetrap-preparations";
import * as DarkTheme from "./operations/dark-theme";
import * as Proofreading from "./operations/proofreading";

const ALWAYS: boolean = true;

/*
******** README ********

Operations to run as soon as possible during page load are declared in this file.

Every item must be an object with the following structure:
{
    description : a brief description of the operation in the infinitive sense, whose main purpose is to identify operations failing as a consequence of the host site changing its content
    condition   : whether the operation should run at all (e.g. some saved preference value)
    selectors   : CSS selectors matching elements required to run the operation
    action      : what to do (e.g. insert a custom element); a function that will be called with the required elements as arguments, in the order they appear in `selectors`
}

`action` may return a boolean (SUCCESS or FAILURE) indicating whether or not it succeeded.

Not returning anything is equivalent to returning undefined, which is equivalent to returning SUCCESS.
*/

const OPERATIONS: ReadonlyArray<Operation> = [
    new IndependentOperation({
        description: "set document id",
        condition: ALWAYS,
        action: () => { document.documentElement.id = CONFIG.ID.document },
    }),
    new IndependentOperation({
        description: "manage dark theme",
        condition: ALWAYS,
        action: DarkTheme.manage,
    }),
    // A regular IndependentOperation does not work when the user is logged out, because document.body is null.
    // An IndependentOperation with waitForDOMContentLoaded does not work when the user is logged in, because DOMContentLoaded never fires.
    new DependentOperation({
        description: "insert preferences menu",
        condition: isOnBSCPreferencesPage,
        selectors: { body: "body" },
        action: INSERT_PREFERENCES_MENU,
    }),
    new IndependentOperation({
        description: "disable scroll restoration",
        condition: Preferences.get(P.advanced._.disable_scroll_restoration),
        action: () => {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
        },
    }),
    new DependentOperation({
        description: "prevent accidental unload (post or message)",
        condition: isInEditMode && Preferences.get(P.advanced._.prevent_accidental_unload),
        selectors: {
            textarea: SELECTOR.textarea,
            actionButtons: SELECTOR.actionButtons,
        },
        action: PREVENT_ACCIDENTAL_UNLOAD.postOrMessage,
    }),
    new IndependentOperation({
        description: "prevent accidental unload (corrections)",
        condition: isReadingEditorialContent && Preferences.get(P.advanced._.prevent_accidental_unload),
        action: PREVENT_ACCIDENTAL_UNLOAD.corrections,
    }),
    new DependentOperation({
        description: "insert web search button",
        condition: !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_web_search_button),
        selectors: {
            searchFieldInput: SELECTOR.searchFieldInput,
            searchFieldWrapper: SELECTOR.searchFieldWrapper,
        },
        action: INSERT_WEB_SEARCH_BUTTON,
    }),
    new DependentOperation({
        description: "manage caret position in textarea",
        condition: isInEditMode,
        selectors: {
            textarea: SELECTOR.textarea,
            // The market doesn't have a dedicated preview button; its save button fills that purpose in this context.
            previewButton: isInEditMode_market ? SELECTOR.saveButton : SELECTOR.previewButton,
        },
        action: MANAGE_CARET_POSITION,
    }),
    new DependentOperation({
        description: "remove mobile site disclaimer",
        condition: isInEditMode_forum,
        selectors: { textarea: SELECTOR.textarea },
        action: REMOVE_MOBILE_SITE_DISCLAIMER,
    }),
    new DependentOperation({
        description: "insert editing tools",
        condition: isInEditMode && Preferences.get(P.editing_tools._.enable),
        selectors: { textarea: SELECTOR.textarea },
        action: INSERT_EDITING_TOOLS,
    }),
    new DependentOperation({
        description: "insert editing tools in quick reply form",
        condition: isReadingThread && Preferences.get(P.editing_tools._.enable) && Preferences.get(P.editing_tools._.in_quick_reply_form),
        selectors: { textarea: SELECTOR.textarea },
        action: INSERT_EDITING_TOOLS,
    }),
    new DependentOperation({
        description: "insert heading toolbar button",
        condition: isInEditMode && Preferences.get(P.edit_mode._.insert_heading_toolbar_button),
        selectors: {
            textarea: SELECTOR.textarea,
            strikeButton: SELECTOR.textareaToolbarStrikeButton,
        },
        action: INSERT_HEADING_TOOLBAR_BUTTON,
    }),
    new DependentOperation({
        description: "insert textarea size toggle",
        condition: isInEditMode && Preferences.get(P.edit_mode._.textarea_size_toggle),
        selectors: {
            textarea: SELECTOR.textarea,
            toolbarInner: SELECTOR.textareaToolbarInner,
        },
        action: INSERT_TEXTAREA_SIZE_TOGGLE,
    }),
    new DependentOperation({
        // Should be inserted before dark theme toggle because they should be in that order.
        description: "insert preferences shortcut",
        condition: !isOnBSCPreferencesPage && Preferences.get(P.general._.insert_preferences_shortcut),
        selectors: { topMenu: SELECTOR.topMenu },
        action: INSERT_PREFERENCES_SHORTCUT,
    }),
    new DependentOperation({
        description: "insert dark theme toggle",
        condition: !isOnBSCPreferencesPage && Preferences.get(P.dark_theme._.show_toggle),
        selectors: { topMenu: SELECTOR.topMenu },
        action: DarkTheme.insertToggle,
    }),
    new DependentOperation({
        description: "prevent accidental signout",
        condition: isLoggedIn && Preferences.get(P.advanced._.prevent_accidental_signout),
        selectors: { signoutButton: "#" + SITE.ID.signoutButton },
        action: PREVENT_ACCIDENTAL_SIGNOUT,
    }),
    new DependentOperation({
        description: "insert preferences link",
        condition: isOnSweclockersSettingsPage,
        selectors: {
            settingsNavigation: SELECTOR.settingsNavigation,
            li: SELECTOR.settingsNavigationItem,
            label: SELECTOR.settingsNavigationLabel,
        },
        action: INSERT_PREFERENCES_LINK,
    }),
    new DependentOperation({
        description: "insert link to top",
        condition: isReadingThread && Preferences.get(P.forum_threads._.insert_link_to_top),
        action: INSERT_LINK_TO_TOP,
        selectors: { parent: SELECTOR.listBulkActions },
    }),
    new IndependentOperation({
        description: "insert PM links",
        condition: Preferences.get(P.forum_threads._.insert_pm_links),
        action: INSERT_PM_LINKS,
        waitForDOMContentLoaded: true,
    }),
    new IndependentOperation({
        description: "fix mobile links",
        condition: isReadingThread && Preferences.get(P.forum_threads._.fix_mobile_links),
        action: FIX_MOBILE_LINKS,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "insert quote signature buttons",
        condition: isReadingThread && Preferences.get(P.forum_threads._.quote_signature_buttons),
        action: INSERT_QUOTE_SIGNATURE_BUTTONS,
        selectors: { quickReplyForm: SELECTOR.quickReplyForm },
    }),
    new DependentOperation({
        description: "adapt corrections link to work with improved corrections",
        condition: isReadingEditorialContent && Preferences.get(P.general._.improved_corrections),
        selectors: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: ADAPT_CORRECTIONS_LINK,
    }),
    new IndependentOperation({
        description: "enable proofreading",
        condition: Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.ALWAYS,
        action: () => {
            // The border must become red before we make it transparent, so we get the nice "flash" effect.
            window.setTimeout(Proofreading.enable, 10);
        },
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add proofreading listeners",
        condition: isReadingEditorialContent && Preferences.get(P.advanced._.proofread_articles) === Proofreading.Options.CORRECTIONS,
        selectors: { correctionsLink: "#" + SITE.ID.correctionsLink },
        action: Proofreading.addListeners,
    }),
    new IndependentOperation({
        description: "perform proofreading processing",
        condition: isReadingEditorialContent || (isInEditMode && Preferences.get(P.advanced._.proofread_forum_posts)),
        action: Proofreading.performProcessing,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "replace followed threads link with a link to my posts",
        condition: isLoggedIn && Preferences.get(P.general._.replace_followed_threads_link),
        selectors: { followedThreadsLinkText: SELECTOR.followedThreadsLinkText },
        action: REPLACE_FOLLOWED_THREADS_LINK,
    }),

    // Keyboard shortcuts
    new IndependentOperation({
        description: "perform Mousetrap preparations",
        condition: ALWAYS,
        action: MOUSETRAP_PREPARATIONS,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add edit mode keyboard shortcut (submit)",
        condition: isInEditMode && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        selectors: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButton,
        },
        action: KEYBOARD_SHORTCUTS_EDIT_MODE.submit,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add edit mode keyboard shortcut (preview)",
        condition: isInEditMode && !isInEditMode_marketContact && Preferences.get(P.edit_mode._.keyboard_shortcuts),
        selectors: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButton,
        },
        action: KEYBOARD_SHORTCUTS_EDIT_MODE.preview,
        waitForDOMContentLoaded: true,
    }),
    new DependentOperation({
        description: "add quick reply keyboard shortcut (submit)",
        condition: isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        selectors: {
            textarea: SELECTOR.textarea,
            saveButton: SELECTOR.saveButtonQuickReply,
        },
        action: KEYBOARD_SHORTCUTS_EDIT_MODE.submit,
    }),
    new DependentOperation({
        description: "add quick reply keyboard shortcut (preview)",
        condition: isReadingThread && Preferences.get(P.edit_mode._.keyboard_shortcuts_in_quick_reply),
        selectors: {
            textarea: SELECTOR.textarea,
            previewButton: SELECTOR.previewButtonQuickReply,
        },
        action: KEYBOARD_SHORTCUTS_EDIT_MODE.preview,
    }),
];

export default OPERATIONS;
