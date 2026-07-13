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
    legendPlugin
);

type Sample = {
    data: unknown;
    options?: Record<string, unknown>;
    plugins?: unknown[];
    type?: string;
    updateData?: (chart: Chart) => boolean;
};

export type SampleStoryArgs = {
    sample: Sample;
};

class SampleChartStory extends HTMLElement {
    private chart?: Chart;
    private sample?: Sample;

    set args(value: SampleStoryArgs) {
        this.sample = value.sample;
        if(this.isConnected) {
            this.renderChart();
        }
    }

    connectedCallback() {
        this.renderChart();
    }

    disconnectedCallback() {
        this.chart?.destroy();
    }

    private renderChart() {
        if(!this.sample) {
            return;
        }

        this.chart?.destroy();
        this.innerHTML = `
            <section style="max-width: 900px; padding: 24px; border: 1px solid #d9dce5; border-radius: 8px; background: #ffffff; box-shadow: 0 8px 24px rgba(20, 34, 58, 0.08);">
                <div style="height: 440px; position: relative;"><canvas></canvas></div>
                <div data-cc style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px);"></div>
            </section>
        `;

        const canvas = this.querySelector("canvas") as HTMLCanvasElement;
        const cc = this.querySelector("[data-cc]") as HTMLDivElement;
        const sourceOptions = this.sample.options ?? {};
        const sourcePlugins = sourceOptions.plugins as Record<string, unknown> | undefined;

        this.chart = new Chart(canvas, {
            ...this.sample,
            type: this.sample.type ?? "bar",
            options: {
                ...sourceOptions,
                plugins: {
                    ...sourcePlugins,
                    chartjs2music: {
                        cc,
                        ...(sourcePlugins?.chartjs2music as Record<string, unknown> | undefined)
                    }
                }
            },
            plugins: [...(this.sample.plugins ?? []), chart2music]
        } as never);

        if(this.sample.updateData) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Update data";
            button.style.cssText = "margin-top: 16px; padding: 8px 12px; border: 1px solid #0c5d9d; border-radius: 4px; background: #ffffff; color: #0c5d9d; font: 600 14px/1 system-ui, sans-serif; cursor: pointer;";
            button.addEventListener("click", () => {
                button.disabled = !this.sample?.updateData?.(this.chart as Chart);
            });
            this.querySelector("section")?.appendChild(button);
        }
    }
}

if(!customElements.get("chart2music-sample-story")) {
    customElements.define("chart2music-sample-story", SampleChartStory);
}

export const renderSample = (args: SampleStoryArgs) => {
    const story = document.createElement("chart2music-sample-story") as SampleChartStory;
    story.args = args;
    return story;
};
