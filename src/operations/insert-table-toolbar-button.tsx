import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "../text";
import { render } from "preact";
import { unlines } from "lines-unlines";
import { toolbarButton } from "./editing-tools";
import { insert, indent } from "./logic/textarea";
import { startTag, endTag, empty } from "../bb";

const enum Headings { NONE, FIRST, ALL }

interface TableConfig {
    readonly rows: number
    readonly columns: number
    readonly headings: boolean
}

const TABLE_CONFIG: TableConfig = { rows: 4, columns: 3, headings: true };

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

function table(config: TableConfig): string {
    const headingRow = tableRowLines(config.columns, Headings.ALL);
    const regularRow = tableRowLines(config.columns, config.headings ? Headings.FIRST : Headings.NONE);
    const theadLines = concat([
        startTag("thead"),
        headingRow.map(indent),
        endTag("thead"),
    ]);
    const tbodyLines = concat([
        startTag("tbody"),
        concat(replicate(config.rows - 1, regularRow.map(indent))),
        endTag("tbody"),
    ]);
    const tableLines = concat([
        startTag("table"),
        theadLines.map(indent),
        tbodyLines.map(indent),
        endTag("table"),
    ]);
    return unlines(tableLines);
}

function tableRowLines(columns: number, headings: Headings): ReadonlyArray<string> {
    const cell_first = headings === Headings.NONE ? "td" : "th";
    const cell_rest = headings === Headings.ALL ? "th" : "td";
    return concat([
        startTag("tr"),
        indent(empty(cell_first)),
        replicate(columns - 1, indent(empty(cell_rest))),
        endTag("tr"),
    ]);
}

// From Haskell. Example: replicate(3, 42) = [42, 42, 42]
function replicate<T>(n: number, x: T): ReadonlyArray<T> {
    return Array(n).fill(x);
}

function concat(xs: ReadonlyArray<string | ReadonlyArray<string>>): ReadonlyArray<string> {
    return ([] as Array<string>).concat(...xs);
}
