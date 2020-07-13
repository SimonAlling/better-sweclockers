import * as BB from "bbcode-tags";
import classNames from "classnames";
import { lines, unlines } from "lines-unlines";
import { h } from "preact";

import * as CONFIG from "~src/config";
import iconExpander from "~src/icons/expander.svg";
import iconSearchLink from "~src/icons/search-link.svg";
import iconQuote from "~src/icons/quote.svg";
import iconSplitQuote from "~src/icons/split-quote.svg";
import { SearchEngine, searchURL } from "~src/search-engines";
import * as SITE from "~src/site";
import * as T from "~src/text";
import { InsertButtonDescription } from "~src/types";
import { fromMaybeUndefined, r } from "~src/utilities";

import * as Smileys from "./smileys";
import { Action, CursorBehavior, insert, insertIn, placeCursorIn, selectedTextIn, wrapIn, wrap_tag, wrap_verbatim } from "./textarea";

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
        icon: { type: "RAW", image: iconSearchLink },
    }),
    shibe: generalButton({
        label: T.editing_tools.label_shibe,
        tooltip: T.editing_tools.tooltip_shibe,
        class: CONFIG.CLASS.shibe,
        action: (textarea, _) => insertIn(textarea, { string: shibeText(selectedTextIn(textarea)), replace: true }),
    }),
    doge: generalButton({
        tooltip: T.editing_tools.tooltip_doge,
        action: insert(CONFIG.CONTENT.doge),
        icon: { type: "URL", image: CONFIG.ICONS.DOGE },
    }),
    quote: tagButton({
        tag: SITE.TAG.quote,
        parameterized: true,
        block: true,
        tooltip: T.editing_tools.tooltip_quote,
        icon: { type: "RAW", image: iconQuote },
    }),
    splitQuote: generalButton({
        tooltip: T.editing_tools.tooltip_split_quote,
        action: ACTION_SPLIT_QUOTE,
        icon: { type: "RAW", image: iconSplitQuote },
    }),
    expander: tagButton({
        tag: SITE.TAG.expander,
        tooltip: T.editing_tools.tooltip_expander,
        block: true,
        icon: { type: "RAW", image: iconExpander },
    }),
} as const;

export const BUTTONS = {
    meta: [
        tagButton({ tag: SITE.TAG.ins, label: T.editing_tools.label_ins, tooltip: T.editing_tools.tooltip_ins }),
        tagButton({ tag: SITE.TAG.del, label: T.editing_tools.label_del, tooltip: T.editing_tools.tooltip_del }),
    ],
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
    definitions: [
        tagButton({ tag: SITE.TAG.dl, label: T.editing_tools.label_dl, tooltip: T.editing_tools.tooltip_dl, block: true }),
        tagButton({ tag: SITE.TAG.dt, label: T.editing_tools.label_dt, tooltip: T.editing_tools.tooltip_dt }),
        tagButton({ tag: SITE.TAG.dd, label: T.editing_tools.label_dd, tooltip: T.editing_tools.tooltip_dd }),
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
    "magenta",
];

export type Icon = Readonly<{ type: "RAW" | "URL", image: string }>

type ButtonDescription = Readonly<{
    label?: string,
    tooltip?: string,
    class?: string,
    tag: string,
    parameterized?: boolean,
    block?: boolean,
    icon?: Icon,
    custom?: boolean,
    cursor?: CursorBehavior,
    action: Action,
    style?: string,
}>

type TagButtonDescription = Pick<ButtonDescription, "tag" | "label" | "tooltip" | "class" | "icon" | "parameterized" | "block">

export type Button = (textarea: HTMLTextAreaElement, undoSupport: boolean) => JSX.Element

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

export function smileyButton(smiley: Smileys.Smiley): Button {
    return generalButton({
        label: "",
        tooltip: Smileys.codeFor(smiley),
        custom: true,
        class: classNames(SITE.CLASS.smiley, Smileys.classFor(smiley)),
        action: insert(" " + Smileys.codeFor(smiley) + " "), // Spaces are necessary around a smiley. (Multiple ones collapse.)
    });
}

export function generalButton(button: Pick<ButtonDescription, "label" | "tooltip" | "class" | "icon" | "custom" | "action" | "style">): Button {
    return (textarea, undoSupport) => {
        const icon = button.icon;
        const label = (icon === undefined ? "" : icon.type === "URL" ? `<img src="${icon.image}" />` : icon.image) + fromMaybeUndefined("", button.label);
        const className = [
            button.class || "",
            button.custom ? "" : SITE.CLASS.button,
            icon === undefined ? "" : " " + CONFIG.CLASS.iconButton,
        ].join(" ").trim();
        return (
            <a
                dangerouslySetInnerHTML={{__html: label}}
                title={button.tooltip}
                class={className}
                style={button.style}
                onClick={() => button.action(textarea, undoSupport) }
                href="javascript:void(0)"
            />
        );
    };
}

export function toolbarButton(button: Pick<ButtonDescription, "tooltip" | "class" | "action" | "style">): Button {
    return (textarea, undoSupport) => (
        <div
            title={button.tooltip}
            class={[ SITE.CLASS.toolbarButton, button.class || "" ].join(" ").trim()}
            style={button.style}
        >
            <div class={SITE.CLASS.inner} onClick={() => button.action(textarea, undoSupport)}>
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

function ACTION_IMG(textarea: HTMLTextAreaElement, undoSupport: boolean): void {
    const selection = selectedTextIn(textarea);
    if (!selection.includes("\n")) {
        wrap_tag({ tag: SITE.TAG.img, parameterized: false, block: false })(textarea, undoSupport);
    } else {
        const imgify = (line: string) => line.trim() === "" ? "" : BB.start(SITE.TAG.img) + line.trim() + BB.end(SITE.TAG.img);
        insertIn(textarea, { string: unlines(lines(selection).map(imgify)), replace: true });
    }
}

function ACTION_SEARCH_LINK(engine: SearchEngine) {
    return (textarea: HTMLTextAreaElement, _: boolean): void => {
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

function ACTION_SPLIT_QUOTE(textarea: HTMLTextAreaElement, undoSupport: boolean): void {
    // Yes, this code is hard to understand. It was conceived using a considerable amount of trial and error.
    const beforeSelection = textarea.value.substring(0, textarea.selectionStart);
    const afterSelection = textarea.value.substring(textarea.selectionEnd);
    const existingNewlinesBeforeSelection = beforeSelection.match(/\n*$/)![0].length;
    const existingNewlinesAfterSelection = afterSelection.match(/^\n*/)![0].length;
    const cursorIsBetweenTwoExistingQuotes = (
        new RegExp(r`\[\/${SITE.TAG.quote}\]$`, "i").test(beforeSelection.trimRight())
        &&
        new RegExp(r`^\[${SITE.TAG.quote}`, "i").test(afterSelection.trimLeft())
    );
    if (cursorIsBetweenTwoExistingQuotes) {
        // Just insert empty lines and place the cursor accordingly.
        const numberOfNewlinesToInsert = Math.max(
            0, // Using a negative value with String.prototype.repeat is a RangeError.
            CONFIG.CONTENT.splitQuoteEmptyLines + 1 - existingNewlinesBeforeSelection - existingNewlinesAfterSelection,
        );
        // If there are more newlines than we'd like between the quotes, they will be left untouched, because we don't want to mess with deleting content.
        insertIn(textarea, {
            string: "\n".repeat(numberOfNewlinesToInsert),
            replace: undoSupport,
        });
        placeCursorIn(textarea, beforeSelection.length - existingNewlinesBeforeSelection + 1); // + 1 to get past the first line break
    } else {
        // Add quote tags and place cursor.
        const startTag = BB.start(SITE.TAG.quote);
        const endTag = BB.end(SITE.TAG.quote);
        const extraNewlineBeforeSelectionNeeded = existingNewlinesBeforeSelection === 0;
        const extraNewlineAfterSelectionNeeded = existingNewlinesAfterSelection === 0;
        insertIn(textarea, { string: [
            extraNewlineBeforeSelectionNeeded ? "\n" : "",
            endTag,
            "\n".repeat(CONFIG.CONTENT.splitQuoteEmptyLines + 1),
            startTag,
            extraNewlineAfterSelectionNeeded ? "\n" : "",
        ].join(""), replace: undoSupport });
        placeCursorIn(textarea, beforeSelection.length + (extraNewlineBeforeSelectionNeeded ? 1 : 0) + endTag.length + 1); // + 1 to get past a line break
    }
}

const SPACE = / /g;
const CONSECUTIVE_SPACES = / +/g;

function ACTION_REPLACE_SPACES_WITH_NBSPS(textarea: HTMLTextAreaElement, undoSupport: boolean) {
    const selectedText = selectedTextIn(textarea);
    if (undoSupport || isOKToReplaceSpacesIrrevocably(selectedText)) {
        insertIn(textarea, {
            string: selectedText.replace(SPACE, CONFIG.NBSP),
            replace: true,
        });
    }
}

function isOKToReplaceSpacesIrrevocably(selectedText: string): boolean {
    const n = needsConfirmation(selectedText);
    return n === false || confirm(T.general.nbsps_confirm(n)); // `confirm` is problematic in Chrome (see docs/dialogs.md), but Chrome has full undo support.
}

// A heuristic intended to catch cases when the user likely didn't mean to replace spaces with NBSPs and/or it would be cumbersome to restore the change without undo support.
function needsConfirmation(selectedText: string): false | number {
    const numberOfSelectedSpaces = selectedText.match(SPACE)?.length || 0;
    const numberOfSelectedSpaceSegments = selectedText.match(CONSECUTIVE_SPACES)?.length || 0;
    // Replacing a large number of spread-out spaces with NBSPs is both uncommon and time-consuming to restore.
    const confirmationNeeded = numberOfSelectedSpaces > 10 && numberOfSelectedSpaceSegments > 3
    return confirmationNeeded ? numberOfSelectedSpaces : false;
}
