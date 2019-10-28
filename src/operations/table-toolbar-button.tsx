import { empty, end, start } from "bbcode-tags";
import { unlines } from "lines-unlines";
import { render } from "preact";

import * as SITE from "src/globals-site";
import * as T from "src/text";

import { toolbarButton } from "./logic/editing-tools";
import { indent, insert } from "./logic/textarea";

const enum Headings { NONE, FIRST, ALL }

const TABLE_CONFIG = { rows: 4, columns: 3, headings: true };

const tableToolbarButton = toolbarButton({
    action: textarea => insert(table(TABLE_CONFIG))(textarea), // eta-abstracted to defer table generation until button clicked
    class: SITE.CLASS.toolbarTableButton,
    tooltip: T.general.tooltip_table,
});

export default (e: {
    textarea: HTMLElement,
    unorderedListButton: HTMLElement,
}) => {
    render(tableToolbarButton(e.textarea as HTMLTextAreaElement), e.unorderedListButton.parentElement as HTMLElement);
}

function table(config: Readonly<typeof TABLE_CONFIG>): string {
    const headingRow = tableRowLines(config.columns, Headings.ALL);
    const regularRow = tableRowLines(config.columns, config.headings ? Headings.FIRST : Headings.NONE);
    const theadLines = concat([
        start("thead"),
        headingRow.map(indent),
        end("thead"),
    ]);
    const tbodyLines = concat([
        start("tbody"),
        concat(replicate(config.rows - 1, regularRow.map(indent))),
        end("tbody"),
    ]);
    const tableLines = concat([
        start("table"),
        theadLines.map(indent),
        tbodyLines.map(indent),
        end("table"),
    ]);
    return unlines(tableLines);
}

function tableRowLines(columns: number, headings: Headings): readonly string[] {
    const cell_first = headings === Headings.NONE ? "td" : "th";
    const cell_rest = headings === Headings.ALL ? "th" : "td";
    return concat([
        start("tr"),
        indent(empty(cell_first)),
        replicate(columns - 1, indent(empty(cell_rest))),
        end("tr"),
    ]);
}

// From Haskell. Example: replicate(3, 42) = [42, 42, 42]
function replicate<T>(n: number, x: T): readonly T[] {
    return Array(n).fill(x);
}

function concat(xs: readonly (string | readonly string[])[]): readonly string[] {
    return ([] as string[]).concat(...xs);
}
