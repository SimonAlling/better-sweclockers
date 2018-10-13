import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { NumericPreference } from "ts-preferences";

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
        ? [ T.general.textarea_size_small, require("src/icons/textarea-small.svg") ]
        : [ T.general.textarea_size_large, require("src/icons/textarea-large.svg") ]
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
