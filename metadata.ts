import { Metadata } from "userscript-metadata";
import {
    BuildConfig,
    metadataUrl,
} from "userscripter/build-time";

import U from "./src/userscript";

export default function(buildConfig: BuildConfig): Metadata {
    const hostedAt = buildConfig.hostedAt;
    return {
        name: U.name,
        version: versionBasedOnDate(buildConfig.now),
        description: U.description,
        author: U.author,
        namespace: U.namespace,
        match: [
            `*://${U.hostname}/*`,
            `*://www.${U.hostname}/*`,
        ],
        run_at: U.runAt,
        noframes: U.noframes,
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

export function versionBasedOnDate(d: Date): string {
    return [
        d.getFullYear(),
        d.getMonth() + 1, // 0-indexed
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ].join(".");
}
