import Chart from "chart.js/auto";
import plugin from "../src/c2m-plugin";
import samples from "./charts";
import {BoxPlotController, BoxAndWiskers} from "@sgratzl/chartjs-chart-boxplot";
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import legendPlugin from "chartjs-plugin-a11y-legend";
import 'chartjs-adapter-luxon';

const charts = Object.values(samples);

Chart.register(BoxPlotController, BoxAndWiskers, WordCloudController, WordElement, legendPlugin);

/*
y2 axis
    https://codepen.io/martin-teamofmine/pen/YzjLxXG
data point labelText
    https://codepen.io/BillSegate/details/oNMbYwz
Matrix
    https://codepen.io/krautgti/pen/mdxNeXQ

Other features
* subtitles
* bubble charts
* matrix (plugin)
* interactions, updating data
* radar plot
* scatter plot
* time axis
* make labels easier to hand to the x axis?
* stacked bar charts

Working with other plugins
    bar-funnel
    boxplot
    error-bars
    financial
    geo
    graph
    matrix
    pcp
    sankey
    smith
    stacked100
    treemap
    venn
    word-cloud
    annotation
    datalabels
    hierarchical
    regression
    waterfall
    zoom
    dragdata
    streaming

Fix typescript issues with Chart2Music output
*/

export const generateCharts = (container: HTMLDivElement) => {
    charts.forEach((c) => {
        const {updateData, ...config} = c;
        const newContainer = document.createElement("div");
        const canvas = document.createElement("canvas");
        newContainer.appendChild(canvas);
        container.appendChild(newContainer);

        // @ts-ignore
        const chart = new Chart(canvas, {
            ...config,
            options: {
                ...config.options,
                plugins: {
                    ...config.options?.plugins,
                    chartjs2music: {
                        ...config.options?.plugins?.chartjs2music,
                        cc: document.getElementById("cc"),
                        errorCallback: console.error
                    }
                }
            },
            plugins: [plugin]
        });

        if(!updateData){
            return;
        }

        const button = document.createElement("button");
        button.textContent = "Update";
        button.addEventListener("click", () => {
            button.disabled = !(updateData(chart));
        });
        newContainer.appendChild(button);
    });

}