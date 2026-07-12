import {CategoryScale, Chart, LinearScale} from "chart.js";
import {MatrixController, MatrixElement} from "chartjs-chart-matrix";
import plugin from "../src/c2m-plugin";
import matrixChart from "../samples/charts/matrix";

Chart.register(CategoryScale, LinearScale, MatrixController, MatrixElement, plugin);

(globalThis as any).AudioContext = class {};

class MockAudioEngine {
    masterGain = 0;

    playDataPoint() {}
}

describe("Matrix charts", () => {
    test("navigates columns with right and rows with up", () => {
        const createChart = () => {
            const canvas = document.createElement("canvas");
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
            return {canvas, chart};
        };

        const horizontal = createChart();
        horizontal.canvas.dispatchEvent(new Event("focus"));
        horizontal.canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowRight", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(horizontal.chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(horizontal.chart.getActiveElements()[0].index).toBe(4);
        horizontal.chart.destroy();

        const vertical = createChart();
        vertical.canvas.dispatchEvent(new Event("focus"));
        vertical.canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp", bubbles: true}));
        jest.advanceTimersByTime(250);
        expect(vertical.chart.getActiveElements()[0].datasetIndex).toBe(0);
        expect(vertical.chart.getActiveElements()[0].index).toBe(1);
        vertical.chart.destroy();
    });

    test.todo("uses numeric matrix coordinates without category labels");
    test.todo("supports multiple matrix datasets");
});
