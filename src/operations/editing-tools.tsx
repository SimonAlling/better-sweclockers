import { compose } from "@typed/compose";
import classNames from "classnames";
import { h, JSX } from "preact";

import * as CONFIG from "~src/config";
import { insertAfter, insertBefore, renderIn } from "~src/operations/logic/render";
import { P, Preferences } from "~src/preferences";
import { Position } from "~src/preferences/editing-tools";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { BUTTON, BUTTONS, Button, COLORS, colorButton, insertButton, smileyButton, tagButton } from "./logic/editing-tools";
import { SMILEYS } from "./logic/smileys";

export default (undoSupport: boolean) => (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea;
    const position = Preferences.get(P.editing_tools._.position);
    const insertBeforeOrAfter = position === Position.ABOVE ? insertBefore : insertAfter;
    const textareaParent = textarea.parentElement as HTMLElement;
    renderIn(textareaParent, insertBeforeOrAfter(textarea), (
        <EditingTools textarea={textarea as HTMLTextAreaElement} config={getEditingToolsConfig()} undoSupport={undoSupport} />
    ));
};

interface EditingToolsConfig {
    special_characters: boolean
    meta: boolean
    code: boolean
    math: boolean
    whitespace: boolean
    definitions: boolean
    embed: boolean
    doge: boolean
    color_palette: boolean
    smileys: boolean
}

// Needs to be a function because it's used "live" in the preferences menu:
export function getEditingToolsConfig(): EditingToolsConfig {
    return {
        special_characters: Preferences.get(P.editing_tools._.special_characters),
        meta: Preferences.get(P.editing_tools._.meta),
        code: Preferences.get(P.editing_tools._.code),
        math: Preferences.get(P.editing_tools._.math),
        whitespace: Preferences.get(P.editing_tools._.whitespace),
        definitions: Preferences.get(P.editing_tools._.definitions),
        embed: Preferences.get(P.editing_tools._.embed),
        doge: Preferences.get(P.editing_tools._.doge),
        color_palette: Preferences.get(P.editing_tools._.color_palette),
        smileys: Preferences.get(P.editing_tools._.smileys),
    } as const;
}

export function EditingTools(props: {
    textarea: HTMLTextAreaElement,
    disabled?: boolean,
    config: EditingToolsConfig,
    undoSupport: boolean,
}): JSX.Element {
    // A "connected" button has been connected to the textarea.
    const connected = (b: Button) => b(props.textarea, props.undoSupport);
    const connectedTagButton = compose(connected, tagButton);
    const connectedInsertButton = compose(connected, insertButton);
    const connectedColorButton = compose(connected, colorButton);
    const connectedSmileyButton = compose(connected, smileyButton);
    return (
        <div id={CONFIG.ID.editingTools} class={classNames(
            CONFIG.CLASS.editingTools,
            { [CONFIG.CLASS.disabled]: props.disabled },
            SITE.CLASS.bbcode, // so we can easily mimic forum post styles in our buttons
        )}>
            {props.config.special_characters ? (
                <fieldset>
                    {T.special_characters.map(connectedInsertButton)}
                </fieldset>
            ) : null}
            {connectedTagButton({ tag: SITE.TAG.size, label: T.editing_tools.size_label, tooltip: T.editing_tools.size_tooltip, parameterized: true })}
            {connectedTagButton({ tag: SITE.TAG.color, parameterized: true, tooltip: T.editing_tools.color_tooltip, class: CONFIG.CLASS.button_color })}
            {connectedTagButton({ tag: SITE.TAG.font, tooltip: T.editing_tools.font_tooltip, parameterized: true })}
            {connectedTagButton({ tag: SITE.TAG.mark, label: T.editing_tools.mark_label, tooltip: T.editing_tools.mark_tooltip })}
            {connectedTagButton({ tag: SITE.TAG.abbr, label: T.editing_tools.abbr_label, parameterized: true, tooltip: T.editing_tools.abbr_tooltip })}
            {connected(BUTTON.quote)}
            {connected(BUTTON.splitQuote)}
            {connectedTagButton({ tag: SITE.TAG.bq, label: "", tooltip: T.editing_tools.bq_tooltip, block: true, icon: { type: "RAW", image: CONFIG.ICONS.BLOCKQUOTE }, class: CONFIG.CLASS.button_blockquote })}
            {connected(BUTTON.expander)}
            {connectedTagButton({ tag: SITE.TAG.spoiler, tooltip: T.editing_tools.spoiler_tooltip, block: true, class: CONFIG.CLASS.button_spoiler })}
            {connectedInsertButton({ insert: CONFIG.CONTENT.edit, tooltip: T.editing_tools.edit_tooltip, label: T.editing_tools.edit_label })}
            {props.config.meta ? BUTTONS.meta.map(connected) : []}
            {props.config.code ? BUTTONS.code.map(connected) : []}
            {props.config.math ? BUTTONS.math.map(connected) : []}
            {props.config.whitespace ? BUTTONS.whitespace.map(connected) : []}
            {props.config.definitions ? BUTTONS.definitions.map(connected) : []}
            {props.config.embed ? BUTTONS.embed(Preferences.get(P.editing_tools._.search_engine)).map(connected) : []}
            {props.config.doge ? BUTTONS.doge.map(connected) : []}
            {props.config.color_palette ? (
                <fieldset class={CONFIG.CLASS.colorPalette}>
                    {COLORS.map(connectedColorButton)}
                </fieldset>
            ) : null}
            {props.config.smileys ? (
                <fieldset class={CONFIG.CLASS.smileys}>
                    {SMILEYS.map(connectedSmileyButton)}
                </fieldset>
            ) : null}
        </div>
    );
}
