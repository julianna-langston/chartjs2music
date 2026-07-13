import Chart from "chart.js/auto";
import {BoxAndWiskers, BoxPlotController} from "@sgratzl/chartjs-chart-boxplot";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import {WordCloudController, WordElement} from "chartjs-chart-wordcloud";
import legendPlugin from "chartjs-plugin-a11y-legend";
import "chartjs-adapter-luxon";
import chart2music from "../src/c2m-plugin";

Chart.register(
    BoxPlotController,
    BoxAndWiskers,
    MatrixController,
    MatrixElement,
    WordCloudController,
    WordElement,
    legendPlugin,
    chart2music
);

type Sample = {
    data: unknown;
    options?: Record<string, unknown>;
    type?: string;
};

export type SampleStoryArgs = {
    sample: Sample;
};

export const renderChart = (config: Sample) => {
    const canvas = document.createElement("canvas");
    new Chart(canvas, {
        type: config.type ?? "bar",
        ...config
    } as never);
    return canvas;
};

export const renderSample = ({sample}: SampleStoryArgs) => renderChart(sample);
