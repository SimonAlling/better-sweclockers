import { h, render } from "preact";
import { NumericPreference } from "ts-preferences";

import * as CONFIG from "~src/config";
import * as SITE from "~src/site";
import P from "~src/preferences";
import * as T from "~src/text";
import { Preferences } from "~src/preferences";

export default (e: { textarea: HTMLElement, toolbarInner: HTMLElement }) => {
    const textarea = e.textarea as HTMLTextAreaElement;
    render((
        <div class={[ SITE.CLASS.toolbarGroup, CONFIG.CLASS.textareaSize ].join(" ")}>
            {button(textarea, P.edit_mode._.textarea_size_small)}
            {button(textarea, P.edit_mode._.textarea_size_large)}
        </div>
    ), e.toolbarInner);
}

function button(textarea: HTMLTextAreaElement, mode: NumericPreference): JSX.Element {
    const [ tooltip, icon ] = (
        mode === P.edit_mode._.textarea_size_small
        ? [ T.general.textarea_size_small, require("~src/icons/textarea-small.svg") ]
        : [ T.general.textarea_size_large, require("~src/icons/textarea-large.svg") ]
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
