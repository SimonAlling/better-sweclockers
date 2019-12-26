import {
    BuildConfig,
    metadataUrl,
} from "userscripter/build";
import { Metadata } from "userscript-metadata";

import U from "./src/userscript";

export default function(buildConfig: BuildConfig): Metadata {
    const hostedAt = buildConfig.hostedAt;
    return {
        name: U.name,
        version: U.version,
        description: U.description,
        author: U.author,
        namespace: U.namespace,
        match: [
            `*://${U.hostname}/*`,
            `*://www.${U.hostname}/*`,
        ],
        run_at: U.runAt,
        ...(
            hostedAt === null
            ? {}
            : {
                downloadURL: metadataUrl(hostedAt, U.id, "user"),
                updateURL: metadataUrl(hostedAt, U.id, "meta"),
            }
        ),
    };
}
