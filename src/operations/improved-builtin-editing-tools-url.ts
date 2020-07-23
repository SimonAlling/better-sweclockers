import * as BB from "bbcode-tags";
import { lines, unlines } from "lines-unlines";
import { is } from "ts-type-guards";
import { log } from "userscripter";

import { insertIn, selectRangeIn, selectedTextIn } from "~src/operations/logic/textarea";
import SELECTOR from "~src/selectors";
import * as SITE from "~src/site";
import * as T from "~src/text";

declare namespace Main { const Forms: any; }
declare namespace Taiga { const Strings: any; }

export default (undoSupport: boolean) => () => {
    /*
    This operation must run "early" (before DOMContentLoaded), because otherwise it can't override the default action for the URL button.
    However, it should not run _too_ early, because it fails if SweClockers' script hasn't yet defined Main.

    I haven't managed to make this operation work at all in Firefox; the default action is just not overridden.
    */
    try { // If SweClockers change their "API", we want to fail gracefully.
        Main.Forms.Toolbar.Buttons.HyperlinkButton.prototype.insertTemplate = () => {
            const textarea = document.querySelector(SELECTOR.textarea);
            if (!is(HTMLTextAreaElement)(textarea)) {
                log.error(`Could not find textarea.`);
                return;
            }
            const selectedText = selectedTextIn(textarea);
            const selectedLines = lines(selectedText);
            if (selectedLines.length > 1) {
                // Multiline mode (closely resembling SweClockers' native behavior).
                let n: false | number; // Lets us short-circuit with undo support.
                if (undoSupport || (n = confirmationNeeded(selectedLines), n === false) || confirm(T.general.generic_lines_confirm(n))) {
                    const formattedLines = selectedLines.map(line => (
                        Taiga.Strings.sprintf(
                            BB.start(SITE.TAG.url) + "%s" + BB.end(SITE.TAG.url),
                            Taiga.Strings.trim(line),
                        )
                    ));
                    insertIn(textarea, {
                        string: unlines(formattedLines),
                        replace: true,
                    });
                }
            } else {
                const suggestedLinkUrl = isUrlLike(selectedText) ? selectedText : ""; // Same behavior as SweClockers.
                const suggestedLinkText = selectedText;
                const providedLinkUrl = prompt(T.general.improved_url_button_url, suggestedLinkUrl);
                if (providedLinkUrl === null) {
                    return; // Canceling altogether if the user cancels the prompt feels intuitive.
                }
                const providedLinkText = prompt(T.general.improved_url_button_text, suggestedLinkText);
                if (providedLinkText === null) {
                    return; // Canceling altogether if the user cancels the prompt feels intuitive.
                }
                const finalLinkUrl = providedLinkUrl;
                const finalLinkText = providedLinkText === "" ? finalLinkUrl : providedLinkText;
                const selectionStart = textarea.selectionStart; // Must be calculated before any modification is made.
                const startTag = BB.start(SITE.TAG.url, finalLinkUrl);
                // We _could_ just wrap if the final link text equals the selectedText text, but AFAICT it wouldn't give us any benefits versus inserting and then selecting.
                insertIn(textarea, {
                    string: startTag + finalLinkText + BB.end(SITE.TAG.url),
                    replace: true, // Risk of accidental deletion is low because the user is given two prompts before anything is modified in the textarea.
                });
                const newSelectionStart = selectionStart + startTag.length;
                const newSelectionEnd = newSelectionStart + finalLinkText.length;
                selectRangeIn(textarea, newSelectionStart, newSelectionEnd);
            }
        };
    } catch (err) {
        return err.toString(); // String conversion is necessary for the error to be handled properly by Userscripter.
    }
};

// A heuristic intended to catch cases when the user likely didn't mean to format links and/or it would be cumbersome to restore the change without undo support.
function confirmationNeeded(selectedLines: readonly string[]): false | number {
    return (
        selectedLines.length > 5 && !selectedLines.every(isUrlLike)
            ? selectedLines.length
            : false
    );
}

function isUrlLike(s: string): boolean {
    // The regex is copied from SweClockers.
    return /^([a-z]+:\/\/|www\.)/i.test(s);
}
