import { insertCSS, appendCSS } from "./html";

const MODULE_SEPARATOR = "\n\n";

export interface StylesheetModule {
    condition: boolean;
    css: string;
}

function compose(modules: ReadonlyArray<StylesheetModule>): string {
    return modules.map(m => m.css).join(MODULE_SEPARATOR);
}

export function insert(modules: ReadonlyArray<StylesheetModule>, id?: string): void {
    insertCSS(compose(modules.filter(m => m.condition)), id);
}

export function append(modules: ReadonlyArray<StylesheetModule>, id: string): void {
    appendCSS(compose(modules.filter(m => m.condition)), id);
}
