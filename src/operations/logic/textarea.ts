import * as BB from "bbcode-tags";
import { lines, unlines } from "lines-unlines";
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

export function selectRangeIn(textarea: HTMLTextAreaElement, start: number, end: number): void {
    textarea.setSelectionRange(start, end);
    textarea.focus(); // Must be after setSelectionRange to avoid scrolling to the bottom of the textarea in Chrome.
}

type IndendationDirection = -1 | 1

function startAndEndOfSelectedLinesIn(textarea: HTMLTextAreaElement): readonly [ number, number ] {
    // This function is only intended to be called on a textarea with some selected text.
    const linesInTextarea = lines(textarea.value);
    const { selectionStart, selectionEnd } = textarea;
    let [ firstSelectedLineStart, lastSelectedLineEnd ] = [ 0, textarea.value.length ];
    let traversedCharacters = 0;
    for (const line of linesInTextarea) {
        if (selectionStart >= traversedCharacters && selectionStart <= traversedCharacters + line.length) {
            firstSelectedLineStart = traversedCharacters;
        }
        if (selectionEnd >= traversedCharacters && selectionEnd <= traversedCharacters + line.length) {
            lastSelectedLineEnd = traversedCharacters + line.length;
        }
        traversedCharacters += line.length + 1; // + 1 for newline
    }
    return [ firstSelectedLineStart, lastSelectedLineEnd ];
}

export function indentIn(textarea: HTMLTextAreaElement, direction: IndendationDirection): void {
    const selectedText = selectedTextIn(textarea);
    if (selectedText === "") {
        insertIn(textarea, { string: "\t", replace: false });
    } else {
        const [ start, end ] = startAndEndOfSelectedLinesIn(textarea);
        selectRangeIn(textarea, start, end);
        const indentedLines = indented(selectedText, direction);
        const numberOfAddedCharacters = indentedLines.length - selectedText.length;
        insertIn(textarea, { string: indentedLines, replace: true });
        selectRangeIn(textarea, start + 1, end + numberOfAddedCharacters);
    }
}

function indented(text: string, direction: IndendationDirection): string {
    const indent = (line: string) => direction === 1 ? "\t" + line : line.replace(/^\t/, "");
    return unlines(lines(text).map(indent)).replace(/\n$/, "");
}
