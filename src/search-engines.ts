export const enum SearchEngine {
    // Be careful! These strings are used in the UI.
    GOOGLE = "Google",
    DUCKDUCKGO = "DuckDuckGo",
}

function searchEngineURL(engine: SearchEngine): string {
    switch (engine) {
        case SearchEngine.GOOGLE: return "https://google.com/search?q=";
        case SearchEngine.DUCKDUCKGO: return "https://duckduckgo.com/?q=";
    }
}

export function searchURL(engine: SearchEngine, completePhrase: string): string {
    return searchEngineURL(engine) + completePhrase.trim().replace(/\s+/g, "+");
}

export function siteFilter(hostname: string): string {
    return "site:" + hostname;
}
