import * as SITE from "../globals-site";
import * as CONFIG from "../globals-config";
import * as T from "../text";
import { h } from "preact";
import { lines, unlines } from "lines-unlines";
import * as BB from "bbcode-tags";
import { r, fromMaybeUndefined } from "../utilities";
import { Action, CursorBehavior, wrapIn, wrap_tag, wrap_verbatim, selectedTextIn, insertIn, insert, placeCursorIn } from "./logic/textarea";
import { InsertButtonDescription } from "../types";
import { SearchEngine, searchURL } from "search-engines";

export const BUTTON = {
    nbsps: generalButton({
        label: T.editing_tools.label_nbsps,
        tooltip: T.editing_tools.tooltip_nbsps,
        action: ACTION_REPLACE_SPACES_WITH_NBSPS,
    }),
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
    search: (engine: SearchEngine) => generalButton({
        tooltip: T.editing_tools.tooltip_search_link,
        action: ACTION_SEARCH_LINK(engine),
        icon: { type: "RAW", image: require("src/icons/search-link.svg") },
    }),
    shibe: generalButton({
        label: T.editing_tools.label_shibe,
        tooltip: T.editing_tools.tooltip_shibe,
        class: CONFIG.CLASS.shibe,
        action: textarea => insertIn(textarea, { string: shibeText(selectedTextIn(textarea)), replace: true }),
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
} as const;

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
    whitespace: [
        BUTTON.nbsps,
    ],
    embed: (searchEngine: SearchEngine) => [
        BUTTON.url,
        BUTTON.img,
        BUTTON.search(searchEngine),
    ],
    doge: [
        BUTTON.shibe,
        BUTTON.doge,
    ],
} as const;

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

export type Icon = Readonly<{ type: "RAW" | "URL", image: string }>

type ButtonDescription = Readonly<{
    label?: string
    tooltip?: string
    class?: string
    tag: string
    parameterized?: boolean
    block?: boolean
    icon?: Icon
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
            before: BB.start(SITE.TAG.color, color),
            after: BB.end(SITE.TAG.color),
            cursor: "KEEP_SELECTION",
        }),
    });
}

export function generalButton(button: Pick<ButtonDescription, "label" | "tooltip" | "class" | "icon" | "action" | "style">): Button {
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

export function toolbarButton(button: Pick<ButtonDescription, "tooltip" | "class" | "action" | "style">): Button {
    return textarea => (
        <div
            title={button.tooltip}
            class={[ SITE.CLASS.toolbarButton, button.class || "" ].join(" ").trim()}
            style={button.style}
        >
            <div class={SITE.CLASS.inner} onClick={() => button.action(textarea)}>
                <div class={SITE.CLASS.toolbarButtonIcon}></div>
            </div>
        </div>
    );
}

function shibeText(original: string): string {
    const MAX = 100;
    return unlines(lines(original).map(
        line => [
            BB.start(SITE.TAG.font, CONFIG.CONTENT.shibeFont),
            BB.start(SITE.TAG.color, CONFIG.CONTENT.shibeColor),
            BB.start(SITE.TAG.i),
            CONFIG.NBSP.repeat(randomIntBetween(0, Math.max(0, MAX - line.length))),
            line,
            BB.end(SITE.TAG.i),
            BB.end(SITE.TAG.color),
            BB.end(SITE.TAG.font),
        ].join("")
    ));
}

function randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ACTION_IMG(textarea: HTMLTextAreaElement): void {
    const selection = selectedTextIn(textarea);
    if (!selection.includes("\n")) {
        wrap_tag({ tag: SITE.TAG.img, parameterized: false, block: false })(textarea);
    } else {
        const imgify = (line: string) => line.trim() === "" ? "" : BB.start(SITE.TAG.img) + line.trim() + BB.end(SITE.TAG.img);
        insertIn(textarea, { string: unlines(lines(selection).map(imgify)), replace: true });
    }
}

function ACTION_SEARCH_LINK(engine: SearchEngine) {
    return (textarea: HTMLTextAreaElement): void => {
        const tagName = SITE.TAG.url;
        const selected = selectedTextIn(textarea);
        const startTag = BB.start(tagName, searchURL(engine, selected));
        wrapIn(textarea, {
            before: startTag,
            after: BB.end(tagName),
            cursor: selected === "" ? startTag.length - 2 /* for "] */ : "KEEP_SELECTION",
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
        const startTag = BB.start(SITE.TAG.quote);
        const endTag = BB.end(SITE.TAG.quote);
        textarea.value = beforeSelection + `\n` + endTag + emptyLines + startTag + `\n` + afterSelection;
        placeCursorIn(textarea, beforeSelection.length + 1 + endTag.length + 1); // + 1 + 1 to get past two line breaks
    }
}

function ACTION_REPLACE_SPACES_WITH_NBSPS(textarea: HTMLTextAreaElement) {
    insertIn(textarea, {
        string: selectedTextIn(textarea).replace(/ /g, CONFIG.NBSP),
        replace: true,
    });
}
