import type { Plugin } from "chart.js";
export type C2MPluginOptions = {
    cc?: HTMLElement | null;
    audioEngine?: any;
    errorCallback?: (err: string) => void;
    axes?: {
        x?: any;
        y?: any;
    };
    lang?: string;
};
declare const plugin: Plugin;
export default plugin;
