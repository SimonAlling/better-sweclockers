import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { h, render } from "preact";
import { compose } from "lib/utilities";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { Position } from "../preferences/editing-tools";
import { Button, BUTTON, BUTTONS, COLORS, tagButton, insertButton, colorButton } from "./editing-tools";

export default (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea;
    const position = Preferences.get(P.editing_tools._.position);
    const reference = position === Position.ABOVE ? textarea : textarea.nextSibling;
    const toolbar = document.createElement("div");
    const textareaParent = textarea.parentElement as HTMLElement;
    textareaParent.insertBefore(toolbar, reference);
    render(editingTools(textarea as HTMLTextAreaElement), textareaParent, toolbar);
}

export function fake(enabled: boolean): JSX.Element {
    const fakeEditingTools = editingTools(document.createElement("textarea"));
    fakeEditingTools.attributes.class = (
        [ fakeEditingTools.attributes.class ]
        .concat(enabled ? [] : [ CONFIG.CLASS.disabled ])
        .join(" ")
    );
    return fakeEditingTools;
}

function editingTools(textarea: HTMLTextAreaElement): JSX.Element {
    // A "connected" button has been connected to the textarea.
    const connected = (b: Button) => b(textarea);
    const connectedTagButton = compose(connected, tagButton);
    const connectedInsertButton = compose(connected, insertButton);
    const connectedColorButton = compose(connected, colorButton);
    return (
        <div id={CONFIG.ID.editingTools} class={CONFIG.CLASS.editingTools}>
            {Preferences.get(P.editing_tools._.special_characters) ? (
                <fieldset>
                    {T.special_characters.map(connectedInsertButton)}
                </fieldset>
            ) : null}
            {connectedTagButton({ tag: SITE.TAG.size, label: T.editing_tools.label_size, tooltip: T.editing_tools.tooltip_size, parameterized: true })}
            {connectedTagButton({ tag: SITE.TAG.color, parameterized: true, tooltip: T.editing_tools.tooltip_color, class: CONFIG.CLASS.button_color })}
            {connectedTagButton({ tag: SITE.TAG.font, tooltip: T.editing_tools.tooltip_font, parameterized: true })}
            {connectedTagButton({ tag: SITE.TAG.mark, label: T.editing_tools.label_mark, tooltip: T.editing_tools.tooltip_mark })}
            {connectedTagButton({ tag: SITE.TAG.quote, label: "", parameterized: true, tooltip: T.editing_tools.tooltip_quote, block: true, icon: { type: "RAW", image: CONFIG.ICONS.QUOTE }, class: CONFIG.CLASS.button_quote })}
            {connected(BUTTON.splitQuote)}
            {connectedInsertButton({ insert: CONFIG.CONTENT.edit, tooltip: T.editing_tools.tooltip_edit, label: T.editing_tools.label_edit })}
            {connectedTagButton({ tag: SITE.TAG.spoiler, tooltip: T.editing_tools.tooltip_spoiler, block: true, class: CONFIG.CLASS.button_spoiler })}
            {Preferences.get(P.editing_tools._.code) ? BUTTONS.code.map(connected) : []}
            {Preferences.get(P.editing_tools._.math) ? BUTTONS.math.map(connected) : []}
            {Preferences.get(P.editing_tools._.embed) ? BUTTONS.embed(Preferences.get(P.general._.search_engine)).map(connected) : []}
            {Preferences.get(P.editing_tools._.doge) ? BUTTONS.doge.map(connected) : []}
            {Preferences.get(P.editing_tools._.color_palette) ? (
                <fieldset class={CONFIG.CLASS.colorPalette}>
                    {COLORS.map(connectedColorButton)}
                </fieldset>
            ) : null}
        </div>
    );
}
