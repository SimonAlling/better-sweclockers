const { pathsToModuleNameMapper } = require("ts-jest");

const tsconfig = require("./tsconfig");

const DEPENDENCIES_TO_TRANSPILE = [
    // These dependencies need to be transpiled to work with Jest.
    // For example, `export` in a dependency is a syntax error otherwise.
    "preact",
    "text-field-edit",
];

module.exports = {
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
    ],
    "moduleNameMapper": pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" }),
    "testEnvironment": "jsdom",
    "testMatch": [ "**/?(*.)+(spec|test).[jt]s?(x)" ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.svg$": "<rootDir>/__tests__/svgTransformer.js",
    },
    "transformIgnorePatterns": [
        `/node_modules/(?!${DEPENDENCIES_TO_TRANSPILE.join("|")})`,
    ],
};
