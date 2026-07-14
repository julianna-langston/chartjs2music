import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.ts"],
    framework: {
        name: "@storybook/html-vite",
        options: {}
    },
    viteFinal: async (config) => {
        config.build ??= {};
        // The precompiled Storybook preview runtime is 806 kB minified (225 kB gzip).
        // Chart runtime dependencies are split below, so retain warnings for larger regressions.
        config.build.chunkSizeWarningLimit = 850;
        config.build.rollupOptions ??= {};
        config.build.rollupOptions.output = {
            ...config.build.rollupOptions.output,
            manualChunks(id) {
                if(id.includes("node_modules/chart.js")){
                    return "chartjs";
                }
                if(id.includes("node_modules/chart2music")){
                    return "chart2music";
                }
                if(id.includes("node_modules/chartjs-") || id.includes("node_modules/@sgratzl/chartjs-")){
                    return "chartjs-plugins";
                }
                if(id.includes("/src/c2m-plugin")){
                    return "chartjs2music-plugin";
                }
                if(id.includes("node_modules/@storybook/html/") || id.includes("node_modules/@storybook/html-vite/")){
                    return "storybook-html";
                }
                if(id.includes("node_modules/storybook/dist/preview/")){
                    return "storybook-preview";
                }
                if(id.includes("node_modules/storybook/")){
                    return "storybook-core";
                }
                return undefined;
            }
        };
        return config;
    },
    features: {
        sidebarOnboardingChecklist: false
    }
};

export default config;
