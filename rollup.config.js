import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default [
    {
        input: "src/c2m-plugin.ts",
        output: [
            {
                file: "dist/plugin.js",
                name: "chartjs2music",
                format: "iife"
            }
        ],
        plugins: [
            typescript({tsconfig: "./tsconfig.json"})
        ]
    },
    {
        input: "src/c2m-plugin.ts",
        output: [
            {
                file: "dist/plugin.mjs",
                format: "es"
            }
        ],
        plugins: [
            typescript({tsconfig: "./tsconfig.json"}),
            copy({
                targets: [
                    {src: "src/plugin.d.ts", dest: "dist"}
                ]
            })
        ]
    },
]