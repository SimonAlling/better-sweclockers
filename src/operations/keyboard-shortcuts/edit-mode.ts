import { Action } from "~src/actions";
import { clickOn } from "~src/operations/logic/click";

import { bind } from "./util";

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

export function insertLink(e: {
    textarea: HTMLElement,
    urlButton: HTMLElement,
}) {
    bind(Action.INSERT_LINK, () => e.textarea.matches(":focus"), () => clickOn(e.urlButton));
}
