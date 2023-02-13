import typescript from "@rollup/plugin-typescript";

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
    }
]