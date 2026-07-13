import type {Meta, StoryObj} from "@storybook/html-vite";
import {renderChart} from "./sample-chart";

type StoryArgs = {
    language: "en" | "es";
    enableSound: boolean;
    showLegend: boolean;
    seriesLabel: string;
    scale: number;
};

const baseValues = [18, 31, 24, 42];

const meta = {
    title: "Chart2Music/Options",
    render: (args) => renderChart({
        type: "bar",
        data: {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{
                label: args.seriesLabel,
                data: baseValues.map((value) => value * args.scale),
                backgroundColor: "#2086d7",
                borderColor: "#0c5d9d",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {display: args.showLegend},
                title: {display: true, text: args.seriesLabel},
                chartjs2music: {
                    lang: args.language,
                    axes: {
                        x: {label: "Quarter"},
                        y: {label: "Revenue"}
                    },
                    options: {enableSound: args.enableSound}
                }
            },
            scales: {
                x: {title: {display: true, text: "Quarter"}},
                y: {beginAtZero: true, title: {display: true, text: "Revenue (millions)"}}
            }
        }
    }),
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

export const Playground: Story = {};
