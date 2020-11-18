import { h, JSX, render } from "preact";
import { NumericPreference } from "ts-preferences";

import * as CONFIG from "~src/config";
import iconTextareaLarge from "~src/icons/textarea-large.svg";
import iconTextareaSmall from "~src/icons/textarea-small.svg";
import { P, Preferences } from "~src/preferences";
import * as SITE from "~src/site";
import * as T from "~src/text";

export default (e: { textarea: HTMLElement, toolbarInner: HTMLElement }) => {
    const textarea = e.textarea as HTMLTextAreaElement;
    render((
        <div class={[ SITE.CLASS.toolbarGroup, CONFIG.CLASS.textareaSize ].join(" ")}>
            {button(textarea, P.edit_mode._.textarea_size_small)}
            {button(textarea, P.edit_mode._.textarea_size_large)}
        </div>
    ), e.toolbarInner);
};

function button(textarea: HTMLTextAreaElement, mode: NumericPreference): JSX.Element {
    const [ tooltip, icon ] = (
        mode === P.edit_mode._.textarea_size_small
            ? [ T.general.textarea_size_small, iconTextareaSmall ]
            : [ T.general.textarea_size_large, iconTextareaLarge ]
    );
    return (
        <div class="tbButton iconButton noselect" title={tooltip}>
            <div class="inner">
                <div
                    class={SITE.CLASS.toolbarButtonIcon}
                    onClick={() => apply(mode, textarea)}
                    dangerouslySetInnerHTML={{__html: icon}}
                />
            </div>
        </div>
    );
}

function apply(mode: NumericPreference, textarea: HTMLTextAreaElement): void {
    const size = Preferences.get(mode);
    textarea.style.height = size + "px";
    Preferences.set(P.edit_mode._.textarea_size, size);
}
