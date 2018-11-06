import * as SITE from "../globals-site";
import * as CONFIG from "../globals-config";
import * as T from "../text";
import { h } from "preact";
import { lines, unlines } from "lib/utilities";
import * as BB from "../bb";
import { r, fromMaybeUndefined } from "../utilities";
import { Action, CursorBehavior, wrap, wrap_tag, wrap_verbatim, selectedTextIn, insertIn, insert, placeCursorIn } from "./logic/textarea";
import { InsertButtonDescription } from "../types";

export const BUTTON = {
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
    search: (engine: string) => generalButton({
        tooltip: T.editing_tools.tooltip_search_link,
        action: ACTION_SEARCH_LINK(engine),
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
    expander: tagButton({
        tag: SITE.TAG.expander,
        tooltip: T.editing_tools.tooltip_expander,
        block: true,
        icon: { type: "RAW", image: require("src/icons/expander.svg") },
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
    embed: (searchEngine: string) => [
        BUTTON.url,
        BUTTON.img,
        BUTTON.search(searchEngine),
    ],
    doge: [
        BUTTON.shibe,
        BUTTON.doge,
    ],
};

export const COLORS: ReadonlyArray<string> = [
    "#D00",     // dark red
    "#C15200",  // SweClockers orange
    "#EE8500",  // orange
    "#EC0",     // yellow
    "#20A000",  // green
    "#789922",  // >greentext
    "#106400",  // dark green
    "#0BC",     // turquoise
    "#24F",     // light blue
    "#1525D0",  // dark blue
    "#9000B5",  // purple
    "black",
    "gray",
    "white",
    "red",
    "yellow",
    "lime",
    "green",
    "aqua",
    "blue",
    "magenta"
];

type ButtonDescription = Readonly<{
    label?: string
    tooltip?: string
    class?: string
    tag: string
    parameterized?: boolean
    block?: boolean
    icon?: Readonly<{ type: "RAW" | "URL", image: string }>
    cursor?: CursorBehavior
    action: Action
    style?: string
}>

type TagButtonDescription = Pick<ButtonDescription, "tag" | "label" | "tooltip" | "class" | "icon" | "parameterized" | "block">

export type Button = (textarea: HTMLTextAreaElement) => JSX.Element

export function tagButton(button: TagButtonDescription): Button {
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

export function insertButton(button: InsertButtonDescription): Button {
    return generalButton({
        label: fromMaybeUndefined(button.insert, button.label),
        tooltip: button.tooltip,
        action: insert(button.insert),
    });
}

export function colorButton(color: string): Button {
    return generalButton({
        label: "",
        tooltip: color,
        style: `background: ${color} !important;`, // !important to override Blargmode
        action: wrap_verbatim({
            before: BB.startTag(SITE.TAG.color, color),
            after: BB.endTag(SITE.TAG.color),
            cursor: "KEEP_SELECTION",
        }),
    });
}

function generalButton(button: Pick<ButtonDescription, "label" | "tooltip" | "class" | "icon" | "action" | "style">): Button {
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
                style={button.style}
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

function ACTION_SEARCH_LINK(engine: string) {
    return (textarea: HTMLTextAreaElement): void => {
        const tagName = SITE.TAG.url;
        const tagPlusUrl = `[${tagName}="${engine}`;
        const selected = selectedTextIn(textarea);
        wrap(textarea, {
            before: tagPlusUrl + selected.trim().replace(/ +/g, "+") + `"]`,
            after: BB.endTag(tagName),
            cursor: selected === "" ? tagPlusUrl.length : "KEEP_SELECTION",
        });
    }
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
