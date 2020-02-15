export default {
    id: "better-sweclockers",
    name: "Better SweClockers",
    version: "3.13.1",
    description: "Extra functionality and improved usability for the SweClockers website.",
    author: "Simon Alling",
    hostname: "sweclockers.com",
    sitename: "SweClockers",
    namespace: "simonalling.se",
    runAt: "document-start",
    noframes: true, // because SweClockers has frames with `src=""`
    hostedAt: "https://simonalling.github.io/userscripts/",
} as const;
