import {CategoryScale, Chart, LinearScale} from "chart.js";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import "chartjs-adapter-luxon";
import plugin from "../src/c2m-plugin";
import matrixChart from "../samples/charts/matrix";
import matrixBasic from "../samples/charts/matrix_basic";
import matrixCalendar from "../samples/charts/matrix_calendar";
import matrixCategory from "../samples/charts/matrix_category";
import matrixC2m from "../samples/charts/matrix_c2m";
import matrixTime from "../samples/charts/matrix_time";

Chart.register(CategoryScale, LinearScale, MatrixController, MatrixElement, plugin);

(globalThis as any).AudioContext = class {};

class MockAudioEngine {
    masterGain = 0;

    playDataPoint() {}
}

describe("Matrix charts", () => {
    test("navigates columns with right and rows with up", () => {
        const createChart = () => {
            const parent = document.createElement("div");
            const canvas = document.createElement("canvas");
            parent.appendChild(canvas);
            const chart = new Chart(canvas, {
                ...matrixChart,
                options: {
                    ...matrixChart.options,
                    plugins: {
                        ...matrixChart.options.plugins,
                        chartjs2music: {
                            audioEngine: new MockAudioEngine()
                        }
                    }
                }
            });
            return {canvas, chart, parent};
        };

        const horizontal = createChart();
        horizontal.canvas.dispatchEvent(new Event("focus"));
        expect(horizontal.parent.children[1].textContent).toContain('Y is "Time" from 9 AM to 3 PM.');
        horizontal.canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(horizontal.chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(horizontal.chart.getActiveElements()[0].index).toBe(3);
        horizontal.chart.destroy();

        const vertical = createChart();
        vertical.canvas.dispatchEvent(new Event("focus"));
        vertical.canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(vertical.chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(vertical.chart.getActiveElements()[0].index).toBe(1);

        vertical.canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(vertical.chart.getActiveElements()[0].index).toBe(0);
        vertical.chart.destroy();
    });

    test("creates numeric, category, time, calendar, and Chart2Music matrix examples", () => {
        const examples = [matrixBasic, matrixCategory, matrixTime, matrixCalendar, matrixC2m];
        const charts = examples.map((config) => new Chart(document.createElement("canvas"), config));

        expect(charts.map((chart) => chart.config.type)).toEqual(["matrix", "matrix", "matrix", "matrix", "matrix"]);
        charts.forEach((chart) => chart.destroy());
    });

    test("uses numeric matrix coordinates without category labels", () => {
        const canvas = document.createElement("canvas");
        const chart = new Chart(canvas, {
            ...matrixBasic,
            options: {
                ...matrixBasic.options,
                plugins: {
                    ...matrixBasic.options.plugins,
                    chartjs2music: {audioEngine: new MockAudioEngine()}
                }
            }
        });

        canvas.dispatchEvent(new Event("focus"));
        canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        jest.advanceTimersByTime(250);

        expect(chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(chart.getActiveElements()[0].index).toBe(3);
        chart.destroy();
    });

    test("supports multiple matrix datasets", () => {
        const canvas = document.createElement("canvas");
        const chart = new Chart(canvas, {
            type: "matrix",
            data: {
                datasets: [
                    {label: "First", data: [{x: 1, y: 1, v: 10}, {x: 1, y: 2, v: 20}]},
                    {label: "Second", data: [{x: 1, y: 1, v: 30}, {x: 1, y: 2, v: 40}]}
                ]
            },
            options: {
                plugins: {
                    chartjs2music: {audioEngine: new MockAudioEngine()}
                },
                scales: {
                    x: {offset: true},
                    y: {offset: true}
                }
            }
        });

        canvas.dispatchEvent(new Event("focus"));
        canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(chart.getActiveElements()[0].index).toBe(1);

        canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(chart.getActiveElements()[0].datasetIndex).toBe(1);
        expect(chart.getActiveElements()[0].index).toBe(0);
        chart.destroy();
    });
});
