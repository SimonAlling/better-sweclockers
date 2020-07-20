import * as BB from "bbcode-tags";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import { r } from "~src/utilities";

import { insertIn, placeCursorIn } from "../logic/textarea";

export default function(textarea: HTMLTextAreaElement, undoSupport: boolean): void {
    // Yes, this code is hard to understand. It was conceived using a considerable amount of trial and error.
    const beforeSelection = textarea.value.substring(0, textarea.selectionStart);
    const afterSelection = textarea.value.substring(textarea.selectionEnd);
    const existingNewlinesBeforeSelection = beforeSelection.match(/\n*$/)![0].length;
    const existingNewlinesAfterSelection = afterSelection.match(/^\n*/)![0].length;
    const cursorIsBetweenTwoExistingQuotes = (
        new RegExp(r`\[\/${SITE.TAG.quote}\]$`, "i").test(beforeSelection.trimRight())
        &&
        new RegExp(r`^\[${SITE.TAG.quote}`, "i").test(afterSelection.trimLeft())
    );
    if (cursorIsBetweenTwoExistingQuotes) {
        // Just insert empty lines and place the cursor accordingly.
        const numberOfNewlinesToInsert = Math.max(
            0, // Using a negative value with String.prototype.repeat is a RangeError.
            CONFIG.CONTENT.splitQuoteEmptyLines + 1 - existingNewlinesBeforeSelection - existingNewlinesAfterSelection,
        );
        // If there are more newlines than we'd like between the quotes, they will be left untouched, because we don't want to mess with deleting content.
        insertIn(textarea, {
            string: "\n".repeat(numberOfNewlinesToInsert),
            replace: undoSupport,
        });
        placeCursorIn(textarea, beforeSelection.length - existingNewlinesBeforeSelection + 1); // + 1 to get past the first line break
    } else {
        // Add quote tags and place cursor.
        const startTag = BB.start(SITE.TAG.quote);
        const endTag = BB.end(SITE.TAG.quote);
        const extraNewlineBeforeSelectionNeeded = existingNewlinesBeforeSelection === 0;
        const extraNewlineAfterSelectionNeeded = existingNewlinesAfterSelection === 0;
        insertIn(textarea, { string: [
            extraNewlineBeforeSelectionNeeded ? "\n" : "",
            endTag,
            "\n".repeat(CONFIG.CONTENT.splitQuoteEmptyLines + 1),
            startTag,
            extraNewlineAfterSelectionNeeded ? "\n" : "",
        ].join(""), replace: undoSupport });
        placeCursorIn(textarea, beforeSelection.length + (extraNewlineBeforeSelectionNeeded ? 1 : 0) + endTag.length + 1); // + 1 to get past a line break
    }
}
