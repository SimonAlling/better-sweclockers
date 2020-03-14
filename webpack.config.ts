import * as AppRootPath from "app-root-path";

import {
    createWebpackConfig,
    DEFAULT_BUILD_CONFIG,
    DEFAULT_METADATA_SCHEMA,
} from "userscripter/build";
import * as CONFIG from "./src/config";
import * as SITE from "./src/site";
import * as T from "./src/text";
import U from "./src/userscript";
import METADATA from "./metadata";

export default createWebpackConfig({
    buildConfig: {
        ...DEFAULT_BUILD_CONFIG({
            rootDir: AppRootPath.path,
            id: U.id,
            now: new Date(),
        }),
        hostedAt: U.hostedAt,
        sassVariables: { CONFIG, SITE, T },
    },
    metadata: METADATA,
    metadataSchema: DEFAULT_METADATA_SCHEMA,
    env: process.env,
});
