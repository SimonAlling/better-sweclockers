import { Metadata } from "userscript-metadata";
import { CommandLineOptions } from "command-line-args";
import * as IO from "../.userscripter/build/io";
import * as Options from "../.userscripter/build/options";
import U from "./userscript";

export default function metadata(args: CommandLineOptions): Metadata {
    const hostedAt = (x => x ? x : U.hostedAt)(args[Options.HOSTED_AT]);
    const URL = IO.url({ withDistDir: false })(hostedAt, U.id);
    const d = new Date();
    const nightlyVersionSuffix = [
        "", // leading "."
        d.getFullYear(),
        d.getMonth()+1, // 0-indexed
        d.getDate(),
        d.getHours(),
        d.getMinutes()
    ].join(".");
    const nightly = args[Options.NIGHTLY];
    return {
        name: U.name + (nightly ? " Nightly" : ""),
        version: U.version + (nightly ? nightlyVersionSuffix : ""),
        description: U.description,
        author: U.author,
        namespace: U.namespace,
        match: [
            `*://${U.hostname}/*`,
            `*://www.${U.hostname}/*`,
        ],
        run_at: U.runAt,
        downloadURL: URL("download"),
        updateURL: URL("update"),
    };
}
