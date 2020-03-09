import { clickOn } from "~src/operations/logic/click";

import { Action } from "./action";
import { bind, isFocused } from "./util";

export function submit(e: {
    textarea: HTMLElement,
    saveButton: HTMLElement,
}) {
    bind(Action.SUBMIT, () => true, () => clickOn(e.saveButton));
}

export function preview(e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
}) {
    bind(Action.PREVIEW, () => true, () => clickOn(e.previewButton));
}

export function insertHeader(e: {
    textarea: HTMLElement,
    headerButton: HTMLElement,
}) {
    bind(Action.INSERT_HEADER, isFocused(e.textarea), () => clickOn(e.headerButton));
}

export function insertLink(e: {
    textarea: HTMLElement,
    urlButton: HTMLElement,
}) {
    bind(Action.INSERT_LINK, isFocused(e.textarea), () => clickOn(e.urlButton));
}
