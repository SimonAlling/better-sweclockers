import * as BB from "bbcode-tags";
import classNames from "classnames";
import { lines, unlines } from "lines-unlines";
import { h, JSX } from "preact";

import * as CONFIG from "~src/config";
import iconExpander from "~src/icons/expander.svg";
import iconQuote from "~src/icons/quote.svg";
import iconSearchLink from "~src/icons/search-link.svg";
import iconSplitQuote from "~src/icons/split-quote.svg";
import { SearchEngine } from "~src/search-engines";
import * as SITE from "~src/site";
import * as T from "~src/text";
import { InsertButtonDescription } from "~src/types";
import { fromMaybeUndefined } from "~src/utilities";

import ACTION_REPLACE_SPACES_WITH_NBSPS from "../actions/replace-spaces-with-nbsps";
import ACTION_SEARCH_LINK from "../actions/search-link";
import ACTION_SHIBE from "../actions/shibe";
import ACTION_SPLIT_QUOTE from "../actions/split-quote";

import * as Smileys from "./smileys";
import { Action, CursorBehavior, insert, insertIn, selectedTextIn, wrap_tag, wrap_verbatim } from "./textarea";

export const BUTTON = {
    nbsps: generalButton({
        label: T.editing_tools.nbsps_label,
        tooltip: T.editing_tools.nbsps_tooltip,
        action: ACTION_REPLACE_SPACES_WITH_NBSPS,
    }),
    url: tagButton({
        tag: SITE.TAG.url,
        parameterized: true,
        tooltip: T.editing_tools.url_tooltip,
        icon: { type: "RAW", image: SITE.ICONS.toolbarIcon(SITE.ICONS.position_toolbar_url) },
    }),
    img: generalButton({
        tooltip: T.editing_tools.img_tooltip,
        action: ACTION_IMG,
        icon: { type: "RAW", image: SITE.ICONS.toolbarIcon(SITE.ICONS.position_toolbar_img) },
    }),
    search: (engine: SearchEngine) => generalButton({
        tooltip: T.editing_tools.search_link_tooltip,
        action: ACTION_SEARCH_LINK(engine),
        icon: { type: "RAW", image: iconSearchLink },
    }),
    shibe: generalButton({
        label: T.editing_tools.shibe_label,
        tooltip: T.editing_tools.shibe_tooltip,
        class: CONFIG.CLASS.shibe,
        action: ACTION_SHIBE,
    }),
    doge: generalButton({
        tooltip: T.editing_tools.doge_tooltip,
        action: insert(CONFIG.CONTENT.doge),
        icon: { type: "URL", image: CONFIG.ICONS.DOGE },
    }),
    quote: tagButton({
        tag: SITE.TAG.quote,
        parameterized: true,
        block: true,
        tooltip: T.editing_tools.quote_tooltip,
        icon: { type: "RAW", image: iconQuote },
    }),
    splitQuote: generalButton({
        tooltip: T.editing_tools.split_quote_tooltip,
        action: ACTION_SPLIT_QUOTE,
        icon: { type: "RAW", image: iconSplitQuote },
    }),
    expander: tagButton({
        tag: SITE.TAG.expander,
        tooltip: T.editing_tools.expander_tooltip,
        block: true,
        icon: { type: "RAW", image: iconExpander },
    }),
} as const;

export const BUTTONS = {
    meta: [
        tagButton({ tag: SITE.TAG.ins, label: T.editing_tools.ins_label, tooltip: T.editing_tools.ins_tooltip }),
        tagButton({ tag: SITE.TAG.del, label: T.editing_tools.del_label, tooltip: T.editing_tools.del_tooltip }),
    ],
    code: [
        tagButton({ tag: SITE.TAG.noparse, tooltip: T.editing_tools.noparse_tooltip, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.pre, tooltip: T.editing_tools.pre_tooltip, block: true, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.cmd, tooltip: T.editing_tools.cmd_tooltip, class: CONFIG.CLASS.button_code }),
        tagButton({ tag: SITE.TAG.code, tooltip: T.editing_tools.code_tooltip, block: true, class: CONFIG.CLASS.button_code }),
    ],
    math: [
        tagButton({ tag: SITE.TAG.math, label: T.editing_tools.math_label, tooltip: T.editing_tools.math_tooltip, class: CONFIG.CLASS.button_math }),
        tagButton({ tag: SITE.TAG.sub, label: T.editing_tools.sub_label, tooltip: T.editing_tools.sub_tooltip, class: CONFIG.CLASS.button_math }),
        tagButton({ tag: SITE.TAG.sup, label: T.editing_tools.sup_label, tooltip: T.editing_tools.sup_tooltip, class: CONFIG.CLASS.button_math }),
    ],
    whitespace: [
        BUTTON.nbsps,
    ],
    definitions: [
        tagButton({ tag: SITE.TAG.dl, label: T.editing_tools.dl_label, tooltip: T.editing_tools.dl_tooltip, block: true }),
        tagButton({ tag: SITE.TAG.dt, label: T.editing_tools.dt_label, tooltip: T.editing_tools.dt_tooltip }),
        tagButton({ tag: SITE.TAG.dd, label: T.editing_tools.dd_label, tooltip: T.editing_tools.dd_tooltip }),
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
        style: `background: ${color};`,
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

function ACTION_IMG(textarea: HTMLTextAreaElement, undoSupport: boolean): void {
    const selection = selectedTextIn(textarea);
    if (!selection.includes("\n")) {
        wrap_tag({ tag: SITE.TAG.img, parameterized: false, block: false })(textarea, undoSupport);
    } else {
        const imgify = (line: string) => line.trim() === "" ? "" : BB.start(SITE.TAG.img) + line.trim() + BB.end(SITE.TAG.img);
        insertIn(textarea, { string: unlines(lines(selection).map(imgify)), replace: true });
    }
}
