import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import * as BB from "../bb";
import { h, render } from "preact";
import { compose, lines, unlines } from "lib/utilities";
import { Action, CursorBehavior, wrap, wrap_tag, selectedTextIn, insertIn, insert, placeCursorIn } from "./logic/textarea";
import { r, fromMaybeUndefined } from "../utilities";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";
import { Position } from "../preferences/editing-tools";
import { InsertButtonDescription } from "../types";

export default (e: { textarea: HTMLElement }) => {
    const textarea = e.textarea;
    const position = Preferences.get(P.editing_tools._.position);
    const reference = position === Position.ABOVE ? textarea : textarea.nextSibling;
    const toolbar = document.createElement("div");
    const textareaParent = textarea.parentElement as HTMLElement;
    textareaParent.insertBefore(toolbar, reference);
    render(editingTools(textarea as HTMLTextAreaElement), textareaParent, toolbar);
}

function editingTools(textarea: HTMLTextAreaElement): JSX.Element {
    // A "connected" button has been connected to the textarea.
    const connected = (b: Button) => b(textarea);
    const connectedTagButton = compose(connected, tagButton);
    const connectedInsertButton = compose(connected, insertButton);
    return (
        <div id={CONFIG.ID.editingTools}>
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
            {Preferences.get(P.editing_tools._.embed) ? BUTTONS.embed.map(connected) : []}
            {Preferences.get(P.editing_tools._.doge) ? BUTTONS.doge.map(connected) : []}
        </div>
    );
}

const BUTTON = {
    url: tagButton({
        tag: SITE.TAG.url,
        parameterized: true,
        tooltip: T.editing_tools.tooltip_url,
        icon: { type: "RAW", image: SITE.ICONS.toolbarIcon(SITE.ICONS.position_toolbar_url) },
    }),
    img: generalButton({
        tooltip: T.editing_tools.tooltip_img,
        action: ACTION_IMG,
        icon: { type: "RAW", image: SITE.ICONS.toolbarIcon(SITE.ICONS.position_toolbar_img) },
    }),
    search: generalButton({
        tooltip: T.editing_tools.tooltip_search_link,
        action: ACTION_SEARCH_LINK,
        icon: { type: "RAW", image: require("src/icons/search-link.svg") },
    }),
    shibe: generalButton({
        label: T.editing_tools.label_shibe,
        tooltip: T.editing_tools.tooltip_shibe,
        class: CONFIG.CLASS.shibe,
        action: textarea => insertIn(textarea, shibeText(selectedTextIn(textarea))),
    }),
    doge: generalButton({
        tooltip: T.editing_tools.tooltip_doge,
        action: insert(CONFIG.CONTENT.doge),
        icon: { type: "URL", image: CONFIG.ICONS.DOGE },
    }),
    splitQuote: generalButton({
        tooltip: T.editing_tools.tooltip_split_quote,
        action: ACTION_SPLIT_QUOTE,
        icon: { type: "RAW", image: require("src/icons/split-quote.svg") },
    }),
};

export const BUTTONS = {
    code: [
        tagButton({ tag: SITE.TAG.noparse, tooltip: T.editing_tools.tooltip_noparse, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.pre, tooltip: T.editing_tools.tooltip_pre, block: true, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.cmd, tooltip: T.editing_tools.tooltip_cmd, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.code, tooltip: T.editing_tools.tooltip_code, block: true, class: CONFIG.CLASS.button_code }),
    ],
    math: [
        tagButton({ tag: SITE.TAG.math, label: T.editing_tools.label_math, tooltip: T.editing_tools.tooltip_math, class: CONFIG.CLASS.button_math }),
        tagButton({ tag: SITE.TAG.sub, label: T.editing_tools.label_sub, tooltip: T.editing_tools.tooltip_sub, class: CONFIG.CLASS.button_math }),
        tagButton({ tag: SITE.TAG.sup, label: T.editing_tools.label_sup, tooltip: T.editing_tools.tooltip_sup, class: CONFIG.CLASS.button_math }),
    ],
    embed: [
        BUTTON.url,
        BUTTON.img,
        BUTTON.search,
    ],
    doge: [
        BUTTON.shibe,
        BUTTON.doge,
    ],
};

interface ButtonDescription {
    readonly label?: string
    readonly tooltip?: string
    readonly class?: string
    readonly tag: string
    readonly parameterized?: boolean
    readonly block?: boolean
    readonly icon?: { type: "RAW" | "URL", image: string }
    readonly cursor?: CursorBehavior
    readonly action: Action
}

type TagButtonDescription = Pick<ButtonDescription, "tag" | "label" | "tooltip" | "class" | "icon" | "parameterized" | "block">

type Button = (textarea: HTMLTextAreaElement) => JSX.Element

function tagButton(button: TagButtonDescription): Button {
    return generalButton({
        label: fromMaybeUndefined(button.icon === undefined ? button.tag : "", button.label),
        tooltip: button.tooltip,
        class: button.class,
        icon: button.icon,
        action: wrap_tag({
            tag: button.tag,
            parameterized: fromMaybeUndefined(false, button.parameterized),
            block: fromMaybeUndefined(false, button.block),
        }),
    });
}

function insertButton(button: InsertButtonDescription): Button {
    return generalButton({
        label: fromMaybeUndefined(button.insert, button.label),
        tooltip: button.tooltip,
        action: insert(button.insert),
    });
}

function generalButton(button: Pick<ButtonDescription, "label" | "tooltip" | "class" | "icon" | "action">): Button {
    return textarea => {
        const icon = button.icon;
        const label = (icon === undefined ? "" : icon.type === "URL" ? `<img src="${icon.image}" />` : icon.image) + fromMaybeUndefined("", button.label);
        const className = [
            button.class || "",
            SITE.CLASS.button,
            icon === undefined ? "" : " " + CONFIG.CLASS.iconButton,
        ].join(" ").trim();
        return (
            <a
                dangerouslySetInnerHTML={{__html: label}}
                title={button.tooltip}
                class={className}
                onClick={() => button.action(textarea) }
                href="javascript:void(0)"
            />
        );
    };
}

function shibeText(original: string): string {
    const MAX = 100;
    const NBSP = " ";
    const lines = original.split("\n");
    return lines.map(
        line => [
            BB.startTag(SITE.TAG.font, CONFIG.CONTENT.shibeFont),
            BB.startTag(SITE.TAG.color, CONFIG.CONTENT.shibeColor),
            BB.startTag(SITE.TAG.i),
            NBSP.repeat(randomIntBetween(0, Math.max(0, MAX - line.length))),
            line,
            BB.endTag(SITE.TAG.i),
            BB.endTag(SITE.TAG.color),
            BB.endTag(SITE.TAG.font),
        ].join("")
    ).join("\n");
}

function randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ACTION_IMG(textarea: HTMLTextAreaElement): void {
    const selection = selectedTextIn(textarea);
    if (!selection.includes("\n")) {
        wrap_tag({ tag: SITE.TAG.img, parameterized: false, block: false })(textarea);
    } else {
        const imgify = (line: string) => line.trim() === "" ? "" : BB.startTag(SITE.TAG.img) + line.trim() + BB.endTag(SITE.TAG.img);
        insert(unlines(lines(selection).map(imgify)))(textarea);
    }
}

function ACTION_SEARCH_LINK(textarea: HTMLTextAreaElement): void {
    const tagName = SITE.TAG.url;
    const tagPlusUrl = `[${tagName}="${Preferences.get(P.general._.search_engine)}`;
    const selected = selectedTextIn(textarea);
    wrap(textarea, {
        before: tagPlusUrl + selected.trim().replace(/ +/g, "+") + `"]`,
        after: BB.endTag(tagName),
        cursor: selected === "" ? tagPlusUrl.length : "KEEP_SELECTION",
    });
}

function ACTION_SPLIT_QUOTE(textarea: HTMLTextAreaElement): void {
    const emptyLines = "\n".repeat(CONFIG.CONTENT.splitQuoteEmptyLines + 1);
    const beforeSelection = textarea.value.substring(0, textarea.selectionStart).trimRight();
    const afterSelection = textarea.value.substring(textarea.selectionEnd).trimLeft();
    if (new RegExp(r`\[\/${SITE.TAG.quote}\]$`, "i").test(beforeSelection) && new RegExp(r`^\[${SITE.TAG.quote}`, "i").test(afterSelection)) {
        // Cursor is between two existing quotes, so just insert empty lines and place the cursor accordingly:
        textarea.value = beforeSelection + emptyLines + afterSelection;
        placeCursorIn(textarea, beforeSelection.length + 1); // + 1 to get past the first inserted line break
    } else {
        // Cursor is not between two existing quotes, so add quote tags as well:
        const startTag = BB.startTag(SITE.TAG.quote);
        const endTag = BB.endTag(SITE.TAG.quote);
        textarea.value = beforeSelection + `\n` + endTag + emptyLines + startTag + `\n` + afterSelection;
        placeCursorIn(textarea, beforeSelection.length + 1 + endTag.length + 1); // + 1 + 1 to get past two line breaks
    }
}
