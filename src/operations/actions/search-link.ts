import * as BB from "bbcode-tags";

import { SearchEngine, searchURL } from "~src/search-engines";
import * as SITE from "~src/site";

import { selectedTextIn, wrapIn } from "../logic/textarea";

export default (engine: SearchEngine) => (textarea: HTMLTextAreaElement, _: boolean) => {
    const tagName = SITE.TAG.url;
    const selected = selectedTextIn(textarea);
    const startTag = BB.start(tagName, searchURL(engine, selected));
    wrapIn(textarea, {
        before: startTag,
        after: BB.end(tagName),
        cursor: selected === "" ? startTag.length - 2 /* for "] */ : "KEEP_SELECTION",
    });
};
