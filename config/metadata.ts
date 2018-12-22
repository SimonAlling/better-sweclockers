import { Metadata } from "userscript-metadata";
import { CommandLineOptions } from "command-line-args";
import * as IO from "../.userscripter/build/io";
import * as Options from "../.userscripter/build/options";
import U from "./userscript";

export default function metadata(args: CommandLineOptions): Metadata {
    const URL = IO.url({ withDistDir: false })(U.hostedAt, U.id);
    return {
        name: U.name,
        version: U.version,
        match: [
            `*://${U.hostname}/*`,
            `*://www.${U.hostname}/*`,
        ],
        run_at: U.runAt,
        downloadURL: URL("download"),
        updateURL: URL("update"),
    };
}
