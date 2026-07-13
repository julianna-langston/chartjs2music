import {BarController, BarElement, CategoryScale, Chart, LinearScale} from "chart.js";
import type { Meta, StoryObj } from "@storybook/html-vite";
import chart2music from "../src/c2m-plugin";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, chart2music);

type StoryArgs = {
    language: "en" | "es";
    enableSound: boolean;
    showLegend: boolean;
    seriesLabel: string;
    scale: number;
};

const baseValues = [18, 31, 24, 42];

class SonifiedChartStory extends HTMLElement {
    private chart?: Chart;
    private storyArgs: StoryArgs = {
        language: "en",
        enableSound: false,
        showLegend: false,
        seriesLabel: "Quarterly revenue",
        scale: 1
    };

    set args(value: StoryArgs) {
        this.storyArgs = value;
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
        this.chart?.destroy();
        this.innerHTML = `
            <section style="max-width: 760px; padding: 24px; border: 1px solid #d9dce5; border-radius: 8px; background: #ffffff; box-shadow: 0 8px 24px rgba(20, 34, 58, 0.08);">
                <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <p style="margin: 0 0 4px; color: #526075; font: 600 12px/1.2 system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Chart2Music options</p>
                        <h2 style="margin: 0; color: #172033; font: 700 22px/1.2 system-ui, sans-serif;">Keyboard-ready revenue chart</h2>
                    </div>
                    <span style="padding: 5px 9px; border-radius: 999px; background: #e9f5ed; color: #17643a; font: 600 12px/1 system-ui, sans-serif;">Interactive</span>
                </div>
                <canvas aria-label="Quarterly revenue chart"></canvas>
                <p data-status role="status" style="min-height: 20px; margin: 16px 0 0; color: #3d4b61; font: 14px/1.4 system-ui, sans-serif;">Focus the chart, use arrow keys, then press Enter to select a point.</p>
                <div data-cc style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px);"></div>
            </section>
        `;

        const canvas = this.querySelector("canvas") as HTMLCanvasElement;
        const cc = this.querySelector("[data-cc]") as HTMLDivElement;
        const status = this.querySelector("[data-status]") as HTMLParagraphElement;
        const values = baseValues.map((value) => value * this.storyArgs.scale);

        this.chart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: ["Q1", "Q2", "Q3", "Q4"],
                datasets: [{
                    label: this.storyArgs.seriesLabel,
                    data: values,
                    backgroundColor: "#2086d7",
                    borderColor: "#0c5d9d",
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {display: this.storyArgs.showLegend},
                    title: {display: true, text: this.storyArgs.seriesLabel},
                    chartjs2music: {
                        cc,
                        lang: this.storyArgs.language,
                        axes: {
                            x: {label: "Quarter"},
                            y: {label: "Revenue"}
                        },
                        options: {
                            enableSound: this.storyArgs.enableSound,
                            onFocusCallback: (point) => {
                                status.textContent = `Focused ${point.x}: ${point.y}`;
                            },
                            onSelectCallback: ({point}) => {
                                status.textContent = `Selected ${point.x}: ${point.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {title: {display: true, text: "Quarter"}},
                    y: {beginAtZero: true, title: {display: true, text: "Revenue (millions)"}}
                }
            }
        });
    }
}

if(!customElements.get("chart2music-options-story")) {
    customElements.define("chart2music-options-story", SonifiedChartStory);
}

const meta = {
    title: "Chart2Music/Options Playground",
    render: (args) => {
        const story = document.createElement("chart2music-options-story") as SonifiedChartStory;
        story.args = args;
        return story;
    },
    args: {
        language: "en",
        enableSound: false,
        showLegend: false,
        seriesLabel: "Quarterly revenue",
        scale: 1
    },
    argTypes: {
        language: {control: "select", options: ["en", "es"]},
        enableSound: {control: "boolean"},
        showLegend: {control: "boolean"},
        seriesLabel: {control: "text"},
        scale: {control: {type: "range", min: 0.5, max: 2, step: 0.1}}
    }
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveOptions: Story = {};
