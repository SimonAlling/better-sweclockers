import { render } from "preact";

import { P, Preferences } from "~src/preferences";
import { SearchEngine, searchURL, siteFilter } from "~src/search-engines";
import * as SITE from "~src/site";
import * as T from "~src/text";

import { Icon, generalButton } from "./logic/editing-tools";

export default (e: {
    searchFieldInput: HTMLElement,
    searchFieldWrapper: HTMLElement,
}) => {
    const input = e.searchFieldInput as HTMLInputElement;
    const engine = Preferences.get(P.general._.search_engine);
    const button = generalButton({
        tooltip: T.general.web_search_button_tooltip(engine),
        action: () => searchWithinSite(engine, input.value, false),
        icon: icon(engine),
    });
    const fakeTextarea = document.createElement("textarea");
    render(button(fakeTextarea), e.searchFieldWrapper);
}

function icon(engine: SearchEngine): Icon {
    return { type: "RAW", image: engine[0] };
}

function searchWithinSite(engine: SearchEngine, phrase: string, newWindow: boolean): void {
    const url = searchURL(engine, siteFilter(SITE.HOSTNAME) + " " + phrase);
    newWindow ? window.open(url) : document.location.href = url;
}
