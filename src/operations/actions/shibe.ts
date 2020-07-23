import * as BB from "bbcode-tags";
import { lines, unlines } from "lines-unlines";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { insertIn, selectedTextIn } from "../logic/textarea";

export default function(textarea: HTMLTextAreaElement, undoSupport: boolean): void {
    const selectedText = selectedTextIn(textarea);
    const selectedLines = lines(selectedText);
    if (undoSupport || !shibeConfirmationNeeded(selectedLines) || confirm(T.general.generic_lines_confirm(selectedLines.length))) { // `confirm` is problematic in Chrome (see docs/dialogs.md), but Chrome has full undo support.
        insertIn(textarea, {
            string: shibeText(selectedText),
            replace: true,
        });
    }
}

// A heuristic intended to catch cases when the user likely didn't mean to apply shibe formatting and/or it would be cumbersome to restore the change without undo support.
function shibeConfirmationNeeded(selectedLines: readonly string[]): boolean {
    const nonEmptyLines = selectedLines.filter(line => line !== "");
    const longestLineLength = Math.max(...nonEmptyLines.map(line => line.length));
    // Shibe formatting is usually applied to a few short lines of text ("wow" etc), and content worth protecting tends to have more and/or longer lines.
    return nonEmptyLines.length > 5 || longestLineLength > 15;
}

function shibeText(original: string): string {
    const MAX = 100;
    return unlines(lines(original).map(
        line => [
            BB.start(SITE.TAG.font, CONFIG.CONTENT.shibeFont),
            BB.start(SITE.TAG.color, CONFIG.CONTENT.shibeColor),
            BB.start(SITE.TAG.i),
            CONFIG.NBSP.repeat(randomIntBetween(0, Math.max(0, MAX - line.length))),
            line,
            BB.end(SITE.TAG.i),
            BB.end(SITE.TAG.color),
            BB.end(SITE.TAG.font),
        ].join("")
    ));
}

function randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
