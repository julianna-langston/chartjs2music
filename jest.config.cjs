/** @type {import('jest').Config} */
module.exports = {
    moduleFileExtensions: ["js", "ts"],
    fakeTimers: {
        enableGlobally: true
    },
    // setupFiles: ["<rootDir>/test/_setup.ts"],
    preset: "ts-jest/presets/default-esm",
    transform: {
        "^.+\\.ts?$": ["ts-jest", {
            useESM: true,
            isolatedModules: true
        }]
    },
    transformIgnorePatterns: [
        "node_modules/!(chart2music|chart\.js)/*"
    ],
    testRegex: ".+\\.test\\.ts?$",
    testEnvironment: "jsdom",
    collectCoverageFrom: [
        "src/c2m-plugin.ts"
    ],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "babel",
    setupFiles: [
        "<rootDir>/tests/_setup.ts"
    ]
};
