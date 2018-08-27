import { Metadata } from "userscript-metadata";
import * as IO from "../.userscripter/build/io";
import U from "./userscript";

const URL = IO.url({ withDistDir: false })(U.hostedAt, U.id);

const metadata: Metadata = {
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

export default metadata;
