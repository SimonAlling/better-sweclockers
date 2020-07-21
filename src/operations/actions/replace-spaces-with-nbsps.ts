import * as CONFIG from "~src/config";
import * as T from "~src/text";

import { insertIn, selectedTextIn } from "../logic/textarea";

const SPACE = / /g;
const CONSECUTIVE_SPACES = / +/g;

export default function(textarea: HTMLTextAreaElement, undoSupport: boolean) {
    const selectedText = selectedTextIn(textarea);
    let n: false | number; // Lets us short-circuit with undo support.
    if (undoSupport || (n = confirmationNeeded(selectedText), n === false) || confirm(T.general.nbsps_confirm(n))) { // `confirm` is problematic in Chrome (see docs/dialogs.md), but Chrome has full undo support.
        insertIn(textarea, {
            string: selectedText.replace(SPACE, CONFIG.NBSP),
            replace: true,
        });
    }
}

// A heuristic intended to catch cases when the user likely didn't mean to replace spaces with NBSPs and/or it would be cumbersome to restore the change without undo support.
function confirmationNeeded(selectedText: string): false | number {
    const numberOfSelectedSpaces = selectedText.match(SPACE)?.length || 0;
    const numberOfSelectedSpaceSegments = selectedText.match(CONSECUTIVE_SPACES)?.length || 0;
    // Replacing a large number of spread-out spaces with NBSPs is both uncommon and time-consuming to restore.
    const confirmationNeeded = numberOfSelectedSpaces > 10 && numberOfSelectedSpaceSegments > 3;
    return confirmationNeeded ? numberOfSelectedSpaces : false;
}
