import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as Mousetrap from "mousetrap";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { Action } from "src/actions";

export default (e: {
    textarea: HTMLElement,
    previewButton: HTMLElement,
    saveButton: HTMLElement,
}) => {
    Preferences.get(P.keyboard).forEach(entry => {
        if (entry.action === Action.PREVIEW) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                e.previewButton.click();
            });
        } else if (entry.action === Action.SUBMIT) {
            Mousetrap.bind(entry.shortcut, event => {
                event.preventDefault();
                e.saveButton.click();
            });
        }
    });
}
