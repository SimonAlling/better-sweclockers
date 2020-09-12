export default {
    id: "better-sweclockers",
    name: "Better SweClockers",
    version: "TO_BE_REPLACED_DURING_BUILD",
    description: "Extra functionality and improved usability for the SweClockers website.",
    author: "Simon Alling",
    hostname: "sweclockers.com",
    sitename: "SweClockers",
    namespace: "simonalling.se",
    runAt: "document-start",
    noframes: true, // because SweClockers has frames with `src=""`
    hostedAt: "https://simonalling.github.io/better-sweclockers/",
} as const;
