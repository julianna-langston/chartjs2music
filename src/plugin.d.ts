import type { Plugin } from "chart.js";
import type { C2MChartConfig } from "chart2music";

export type C2MPluginOptions = Pick<C2MChartConfig, "audioEngine" | "axes" | "cc" | "lang" | "options"> & {
    errorCallback?: (err: string) => void;
}
declare const plugin: Plugin;
export default plugin;
