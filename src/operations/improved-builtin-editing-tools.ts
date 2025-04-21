import { errorMessageFromCaught } from "~src/utilities";

import { insertIn, wrapIn } from "./logic/textarea";

declare namespace Tanuki { const Templates: any; }

export default () => {
    /*
    SweClockers' built-in functions use `.value`, which kills undo history.
    This operation replaces them with our own `text-field-edit`-based versions, thereby reintroducing undo/redo support in supported browsers.
    Our versions sort of mimic the default ones, but they feature more intuitive behavior, such as keeping the selection when a wrap tool (e.g. B/U/I) is used.

    We don't care about protecting data in the absence of undo support; I assume SweClockers only ever modify textarea content "safely" (i.e. without deleting anything).
    */
    try { // If SweClockers change their "API", we want to fail gracefully.
        Tanuki.Templates.Textarea.Helpers.setSelection = (textarea: HTMLTextAreaElement, replacement: string) => {
            insertIn(textarea, { string: replacement, replace: true });
        };
        Tanuki.Templates.Textarea.Helpers.insertAtCaret = (textarea: HTMLTextAreaElement, before: string, after: string) => {
            if (after === undefined) {
                insertIn(textarea, { string: before, replace: true });
            } else {
                wrapIn(textarea, { before, after, cursor: "KEEP_SELECTION" });
            }
        };
    } catch (err) {
        return errorMessageFromCaught(err); // String conversion is necessary for the error to be handled properly by Userscripter.
    }
};
