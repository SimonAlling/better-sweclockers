import * as BB from "bbcode-tags";
import * as textFieldEdit from "text-field-edit";
import { isNumber } from "ts-type-guards";

import * as CONFIG from "~src/config";

type InsertionResult = Readonly<{
    textareaContent: string,
    startOfInserted: number,
    endOfInserted: number,
}>

type Insertion = Readonly<{
    string: string,
    replace: boolean,
}>

type WrapAction = Readonly<{
    cursor: CursorBehavior,
    before: string,
    after: string,
}>

type TagWrapAction = Readonly<{
    tag: string,
    parameterized: boolean,
    block: boolean,
}>

export type Action = (textarea: HTMLTextAreaElement, undoSupport: boolean) => void

export type CursorBehavior = number | "KEEP_SELECTION"

export function indent(s: string): string {
    return CONFIG.CONTENT.indentation + s;
}

export function wrapIn(textarea: HTMLTextAreaElement, w: WrapAction): void {
    const replacement = w.before + selectedTextIn(textarea) + w.after;
    // Since wrapping doesn't delete any text, undo support is not relevant and replacing is always safe.
    const insertionResult = insertPure(textarea, { string: replacement, replace: true });
    // We must use textFieldEdit.wrapSelection, because if we use insertPure + textFieldEdit.set, the entire textarea content gets selected when the user issues an undo command.
    textFieldEdit.wrapSelection(textarea, w.before, w.after);
    // Since we use the insertion result here, it must represent the same modification of the textarea content as textFieldEdit.wrapSelection.
    if (isNumber(w.cursor)) {
        placeCursorIn(textarea, insertionResult.startOfInserted + w.cursor);
    } else {
        selectRangeIn(textarea, insertionResult.startOfInserted + w.before.length, insertionResult.endOfInserted - w.after.length);
    }
}

export function wrap_verbatim(w: WrapAction): Action {
    return (textarea, _) => wrapIn(textarea, w);
}

export function wrap_tag(w: TagWrapAction): Action {
    const spacing = w.block ? "\n" : "";
    return wrap_verbatim({
        before: BB.start(w.tag, w.parameterized ? "" : undefined) + spacing,
        after: spacing + BB.end(w.tag),
        cursor: (
            w.parameterized
                ? 1 + w.tag.length + 2 // 1 for '[', 2 for '="'
                : "KEEP_SELECTION"
        ),
    });
}

export function selectedTextIn(textarea: HTMLTextAreaElement): string {
    return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
}

// Simple insertion. Selected text is kept in the absence of undo support to protect against accidental deletion.
export function insert(str: string): Action {
    return (textarea, undoSupport) => insertIn(textarea, { string: str, replace: undoSupport });
}

export function insertIn(textarea: HTMLTextAreaElement, insertion: Insertion): void {
    // The caller of this function is fully responsible for deciding whether to replace selected text or not.
    // textFieldEdit.insert replaces selected text, so if that's not desired, we'll first unselect it such that the insertion is done after the selection.
    if (!insertion.replace) {
        placeCursorIn(textarea, textarea.selectionEnd);
    }
    // We must use textFieldEdit.insert, because if we use insertPure + textFieldEdit.set, the entire textarea content gets selected when the user issues an undo command.
    textFieldEdit.insert(textarea, insertion.string);
    textarea.focus();
}

function insertPure(textarea: HTMLTextAreaElement, insertion: Insertion): InsertionResult {
    const text = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const startOfInsertedText = insertion.replace ? start : end;
    return {
        textareaContent: text.substring(0, startOfInsertedText) + insertion.string + text.substring(end),
        startOfInserted: startOfInsertedText,
        endOfInserted: startOfInsertedText + insertion.string.length,
    };
}

export function placeCursorIn(textarea: HTMLTextAreaElement, position: number): void {
    selectRangeIn(textarea, position, position);
}

function selectRangeIn(textarea: HTMLTextAreaElement, start: number, end: number): void {
    textarea.setSelectionRange(start, end);
    textarea.focus(); // Must be after setSelectionRange to avoid scrolling to the bottom of the textarea in Chrome.
}
