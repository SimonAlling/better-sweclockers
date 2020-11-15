import * as AppRootPath from "app-root-path";
import {
    createWebpackConfig,
    distFileName,
    DEFAULT_BUILD_CONFIG,
    DEFAULT_METADATA_SCHEMA,
} from "userscripter/build";
import * as webpack from "webpack";
import { RawSource } from "webpack-sources";

import METADATA, { versionBasedOnDate } from "./metadata";
import * as CONFIG from "./src/config";
import PROOFREADING from "./src/lib/proofreading/classes";
import * as SITE from "./src/site";
import * as T from "./src/text";
import U from "./src/userscript";

const now = new Date();

const w = createWebpackConfig({
    buildConfig: {
        ...DEFAULT_BUILD_CONFIG({
            rootDir: AppRootPath.path,
            id: U.id,
            now: now,
        }),
        hostedAt: U.hostedAt,
        sassVariables: { CONFIG, PROOFREADING, SITE, T },
    },
    metadata: METADATA,
    metadataSchema: DEFAULT_METADATA_SCHEMA,
    env: process.env,
});

class VersionPlugin {
    public apply(compiler: webpack.Compiler) {
        compiler.hooks.afterCompile.tap(
            VersionPlugin.name,
            compilation => {
                const userscriptAssetName = distFileName(U.id, "user");
                const compiledCode: string = compilation.assets[userscriptAssetName]._value;
                // This doesn't affect metadata at all, only the actual JavaScript:
                compilation.assets[userscriptAssetName] = new RawSource(compiledCode.replace(U.version, versionBasedOnDate(now)));
            },
        );
    }
}

w.plugins?.push(new VersionPlugin());

export default w;
