import Chart from "chart.js/auto";
import {BoxAndWiskers, BoxPlotController} from "@sgratzl/chartjs-chart-boxplot";
import {BarWithErrorBar, BarWithErrorBarsController} from "chartjs-chart-error-bars";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import {WordCloudController, WordElement} from "chartjs-chart-wordcloud";
import legendPlugin from "chartjs-plugin-a11y-legend";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-luxon";
import chart2music from "../src/c2m-plugin";

Chart.register(
    BoxPlotController,
    BoxAndWiskers,
    BarWithErrorBarsController,
    BarWithErrorBar,
    MatrixController,
    MatrixElement,
    WordCloudController,
    WordElement,
    legendPlugin,
    zoomPlugin,
    chart2music
);

type Sample = {
    data: unknown;
    options?: Record<string, unknown>;
    type?: string;
    canvasMaxHeight?: string;
};

export type SampleStoryArgs = {
    sample: Sample;
};

export const renderChart = (config: Sample) => {
    const container = document.createElement("div");
    const canvas = document.createElement("canvas");
    const cc = document.createElement("div");
    const {canvasMaxHeight, ...chartConfig} = config;
    const sourceOptions = chartConfig.options ?? {};
    const sourcePlugins = sourceOptions.plugins as Record<string, unknown> | undefined;

    if(canvasMaxHeight){
        canvas.style.maxHeight = canvasMaxHeight;
    }

    container.append(canvas, cc);
    new Chart(canvas, {
        type: chartConfig.type ?? "bar",
        ...chartConfig,
        options: {
            ...sourceOptions,
            plugins: {
                ...sourcePlugins,
                chartjs2music: {
                    ...(sourcePlugins?.chartjs2music as Record<string, unknown> | undefined),
                    cc
                }
            }
        }
    } as never);
    return container;
};

export const renderSample = ({sample}: SampleStoryArgs) => renderChart(sample);
