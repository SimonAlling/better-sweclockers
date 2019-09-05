import * as SITE from "globals-site";
import * as CONFIG from "globals-config";
import * as T from "text";
import { render } from "preact";
import { generalButton, Icon } from "./editing-tools";
import { SearchEngine, searchURL, siteFilter } from "src/search-engines";
import { Preferences } from "userscripter/preference-handling";
import P from "preferences";

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
