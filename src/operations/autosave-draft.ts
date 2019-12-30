import * as ms from "milliseconds";
import { render } from "preact";
import * as Storage from "ts-storage";
import { isNumber, isString } from "ts-type-guards";
import { log } from "userscripter";

import * as CONFIG from "~src/config";
import P from "~src/preferences";
import { Preferences } from "~src/preferences";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { isCleanSlate_reply } from "./edit-mode";
import { generalButton } from "./logic/editing-tools";

/*
If the user visits a linked post and tried to submit a post "just now", we will
assume it's this one, and delete any autosaved draft.

Should be longer than it usually takes to submit a post, but short enough so the
user is unlikely to do anything else, or give up waiting, meanwhile.
*/
const MAX_MILLISECONDS_TO_COUNT_AS_JUST_NOW = 3000;

/*
If the user visits a linked post that can be determined to have been "recently"
created, we will consider it just posted, so we can go ahead and delete any
autosaved draft.

Should be longer than it usually takes to submit a post, but short enough so the
user is unlikely to submit another post meanwhile.
*/
const MAX_MILLISECONDS_TO_COUNT_AS_RECENTLY = ms.seconds(30);

const AUTOSAVE_INTERVAL_SECONDS = 3;

const MIN_LENGTH_TO_SAVE = 10;

const MAX_LENGTH_TO_SHOW = 200; // when asking if draft should be restored

export function manageAutosaveWatchdog(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
    toolbarInner: HTMLElement,
}) {
    const textarea = e.textarea as HTMLTextAreaElement;
    const changeListener = () => {
        enableWatchdog(textarea);
        textarea.removeEventListener("input", changeListener);
    }
    textarea.addEventListener("input", changeListener);
    e.saveButton.addEventListener("click", () => {
        const nowInMilliseconds = Date.now();
        Storage.set_session(CONFIG.KEY.last_time_user_tried_to_submit, nowInMilliseconds);
    });
    maybeOfferToRestoreAutosavedPost(textarea, e.toolbarInner);
}

export function clearAutosavedDraftIfObsolete(e: { post: HTMLElement }) {
    const result = draftIsObsolete(e.post);
    if (isString(result)) {
        return result;
    } else if (result === true) {
        log.log(`Deleting autosaved draft because the post seems to have been successfully submitted.`);
        clearAutosavedDraft();
    }
}

export function clearAutosavedDraft() {
    Storage.remove(CONFIG.KEY.autosaved_draft);
}

function enableWatchdog(textarea: HTMLTextAreaElement) {
    // Save immediately, regularly and when page is unloaded:
    saveDraft(textarea);
    setInterval(() => saveDraft(textarea), ms.seconds(AUTOSAVE_INTERVAL_SECONDS));
    window.addEventListener("beforeunload", () => saveDraft(textarea));
    if (Preferences.get(P.advanced._.prevent_accidental_unload)) {
        // Assuming it works correctly, prevent accidental unload should be enough protection against misclicks.
        // If the user has confirmed that they want to unload the page, we should consider their saved draft obsolete by virtue of that decision.
        window.addEventListener("unload", clearAutosavedDraft);
    }
}

function saveDraft(textarea: HTMLTextAreaElement): void {
    const text = textarea.value;
    if (mayBeWorthSaving(text)) {
        // Trim because SweClockers does:
        const response = Storage.set(CONFIG.KEY.autosaved_draft, text.trim());
        if (response.status === Storage.Status.STORAGE_ERROR) {
            log.error(`Could not save draft.`);
        }
    } else {
        clearAutosavedDraft();
    }
}

function mayBeWorthSaving(text: string): boolean {
    return text.length >= MIN_LENGTH_TO_SAVE && !isCleanSlate_reply(text);
}

function maybeOfferToRestoreAutosavedPost(textarea: HTMLTextAreaElement, toolbarInner: HTMLElement) {
    const saved = Storage.get(CONFIG.KEY.autosaved_draft, "");
    if (saved.status === Storage.Status.OK && textarea.value !== saved.value) {
        // There is a saved draft that the user might want to restore.
        const button = generalButton({
            label: T.general.restore_draft_label,
            tooltip: T.general.restore_draft_tooltip,
            class: CONFIG.CLASS.button_restoreDraft,
            action: textarea => {
                const draftPreview = shortenedIfLongerThan(MAX_LENGTH_TO_SHOW, saved.value);
                const question_restore = T.general.restore_draft_question + "\n\n" + draftPreview;
                if (confirm(question_restore)) {
                    // Avoid overwriting current textarea content:
                    if (textarea.value === "" || confirm(T.general.restore_draft_confirm)) {
                        textarea.value = saved.value;
                        removeRestoreButton();
                    }
                }
            },
        });
        render(button(textarea), toolbarInner);
    }
}

function removeRestoreButton() {
    // A bit ugly, but it does the trick.
    const buttons = Array.from(document.getElementsByClassName(CONFIG.CLASS.button_restoreDraft));
    for (const button of buttons) button.remove();
}

function draftIsObsolete(post: HTMLElement): boolean | string {
    // Check if user came from any page at all:
    if (document.referrer === "") return false;

    // For subsequent checks, first check if authored by user:
    if (!post.classList.contains(SITE.CLASS.forumPostByCurrentUser)) return false;

    const referrerPath = new URL(document.referrer).pathname;
    const nowInMilliseconds = Date.now();

    // Check if user tried to submit a post just now:
    const lastTimeUserTriedToSubmit = Storage.get_session(CONFIG.KEY.last_time_user_tried_to_submit, 0).value;
    const attemptedSubmitJustNow = nowInMilliseconds < lastTimeUserTriedToSubmit + MAX_MILLISECONDS_TO_COUNT_AS_JUST_NOW;
    if (attemptedSubmitJustNow) return true;

    // Check if recently created:
    const creationTimeInSeconds = getCreationTimeInSeconds(post);
    if (creationTimeInSeconds === null) return couldNotDetermine("created");
    const postCreatedRecently = nowInMilliseconds < ms.seconds(creationTimeInSeconds) + MAX_MILLISECONDS_TO_COUNT_AS_RECENTLY;
    const cameFromEditMode = SITE.PATH.EDIT_MODE_FORUM.test(referrerPath); // assuming user came from within SweClockers
    if (cameFromEditMode && postCreatedRecently) return true;

    // Was not recently created; check if just edited:
    const matchPostID = post.id.match(/\d{7,}/); // all post IDs back to at least 2002
    if (matchPostID === null) return couldNotDetermine("edited");
    const postID = parseInt(matchPostID[0]);
    const cameFromEditingThisPost = referrerPath === SITE.PATH.editPost(postID); // assuming user came from within SweClockers
    const attemptedSubmitRecently = nowInMilliseconds < lastTimeUserTriedToSubmit + MAX_MILLISECONDS_TO_COUNT_AS_RECENTLY
    if (cameFromEditingThisPost && attemptedSubmitRecently) return true;

    // As far as we can tell, any saved draft may still be relevant.
    return false;
}

function couldNotDetermine(kind: "created" | "edited"): string {
    return `Could not determine if post was just ${kind}.`;
}

function getCreationTimeInSeconds(post: HTMLElement): number /* UTC */ | null {
    try {
        const parseResult = JSON.parse(post.dataset.post || "").createTime;
        return isNumber(parseResult) ? parseResult : null;
    } catch (_) {
        return null;
    }
}

/*
(4, "abcd")    => "abcd"
(4, "abcde")   => "ab\n[…]\nde"
(5, "abcde")   => "abcde"
(5, "abcdef")  => "ab\n[…]\ndef"
*/
function shortenedIfLongerThan(max: number, s: string): string {
    return (
        s.length <= max
        ? s
        : s.substr(0, max/2) + "\n[…]\n" + s.substr(s.length - max/2)
    );
}
