import * as CONFIG from "globals-config";
import * as BB from "bbcode-tags";
import { isNumber } from "ts-type-guards";

type InsertionResult = Readonly<{
    textareaContent: string
    startOfInserted: number
    endOfInserted: number
}>

type Insertion = Readonly<{
    string: string
    replace: boolean
}>

type WrapAction = Readonly<{
    cursor: CursorBehavior
    before: string
    after: string
}>

type TagWrapAction = Readonly<{
    tag: string
    parameterized: boolean
    block: boolean
}>

export type Action = (textarea: HTMLTextAreaElement) => void

export type CursorBehavior = number | "KEEP_SELECTION"

export function indent(s: string): string {
    return CONFIG.CONTENT.indentation + s;
}

export function wrapIn(textarea: HTMLTextAreaElement, w: WrapAction): void {
    const replacement = w.before + selectedTextIn(textarea) + w.after;
    const insertionResult = insertPure(textarea, { string: replacement, replace: true });
    textarea.value = insertionResult.textareaContent;
    if (isNumber(w.cursor)) {
        placeCursorIn(textarea, insertionResult.startOfInserted + w.cursor);
    } else {
        selectRangeIn(textarea, insertionResult.startOfInserted + w.before.length, insertionResult.endOfInserted - w.after.length);
    }
}

export function wrap_verbatim(w: WrapAction): Action {
    return textarea => wrapIn(textarea, w);
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

export function insert(str: string) {
    return (textarea: HTMLTextAreaElement) => insertIn(textarea, { string: str, replace: false });
}

// Insert a string right after any selected text (which is kept).
export function insertIn(textarea: HTMLTextAreaElement, insertion: Insertion): void {
    const insertionResult = insertPure(textarea, insertion);
    textarea.value = insertionResult.textareaContent;
    selectRangeIn(textarea, insertionResult.endOfInserted, insertionResult.endOfInserted);
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
    textarea.focus();
    textarea.setSelectionRange(start, end);
};
