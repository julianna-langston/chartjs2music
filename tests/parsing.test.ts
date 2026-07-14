import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    ScatterController
} from "chart.js";
import plugin from "../src/c2m-plugin";

Chart.register(BarController, BarElement, CategoryScale, LineController, LineElement, LinearScale, PointElement, ScatterController, plugin);

class MockAudioEngine {
    masterGain = 0;

    playDataPoint() {}
}

const createCanvas = () => {
    const parent = document.createElement("div");
    const canvas = document.createElement("canvas");
    parent.appendChild(canvas);
    return {parent, canvas};
}

describe("Chart.js parsing mappings", () => {
    test("announces chart-level mapped bar data", () => {
        const {parent, canvas} = createCanvas();
        const onFocusCallback = jest.fn();
        const chart = new Chart(canvas, {
            type: "bar",
            data: {
                datasets: [{
                    data: [
                        {period: "January", metrics: {sales: 12}},
                        {period: "February", metrics: {sales: 18}}
                    ]
                }]
            },
            options: {
                parsing: {xAxisKey: "period", yAxisKey: "metrics.sales"},
                plugins: {chartjs2music: {audioEngine: new MockAudioEngine(), options: {onFocusCallback}}}
            }
        });

        canvas.dispatchEvent(new Event("focus"));

        expect(parent.children[1].textContent).toContain('X is "" from January to February.');
        expect(parent.children[1].textContent).toContain('Y is "" from 12 to 18.');
        expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
            point: expect.objectContaining({x: 0, y: 12})
        }));
        chart.destroy();
    });

    test("uses dataset parsing instead of a chart-level mapping", () => {
        const {canvas} = createCanvas();
        const onFocusCallback = jest.fn();
        const chart = new Chart(canvas, {
            type: "line",
            data: {
                datasets: [{
                    label: "Revenue",
                    parsing: {xAxisKey: "month", yAxisKey: "amount"},
                    data: [{month: "January", amount: 30}, {month: "February", amount: 45}]
                }, {
                    label: "Forecast",
                    parsing: {xAxisKey: "month", yAxisKey: "amount"},
                    data: [{month: "January", amount: 35}, {month: "February", amount: 50}]
                }]
            },
            options: {
                parsing: {xAxisKey: "ignored.x", yAxisKey: "ignored.y"},
                plugins: {chartjs2music: {audioEngine: new MockAudioEngine(), options: {onFocusCallback}}}
            }
        });

        canvas.dispatchEvent(new Event("focus"));

        expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
            point: expect.objectContaining({x: 0, y: 30})
        }));
        chart.destroy();
    });

    test("preserves numeric scatter coordinates from parsing mappings", () => {
        const {parent, canvas} = createCanvas();
        const onFocusCallback = jest.fn();
        const chart = new Chart(canvas, {
            type: "scatter",
            data: {
                datasets: [{
                    data: [
                        {coordinates: {x: 12, y: 24}},
                        {coordinates: {x: 48, y: 60}}
                    ]
                }]
            },
            options: {
                parsing: {xAxisKey: "coordinates.x", yAxisKey: "coordinates.y"},
                plugins: {chartjs2music: {audioEngine: new MockAudioEngine(), options: {onFocusCallback}}}
            }
        });

        canvas.dispatchEvent(new Event("focus"));

        expect(parent.children[1].textContent).toContain('X is "" from 10 to 50.');
        expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
            point: expect.objectContaining({x: 12, y: 24})
        }));
        chart.destroy();
    });

    test("updates mapped data after Chart.js updates", () => {
        const {parent, canvas} = createCanvas();
        const chart = new Chart(canvas, {
            type: "line",
            data: {
                datasets: [{data: [{month: "January", amount: 10}, {month: "February", amount: 20}]}]
            },
            options: {
                parsing: {xAxisKey: "month", yAxisKey: "amount"},
                plugins: {chartjs2music: {audioEngine: new MockAudioEngine()}}
            }
        });

        chart.data.datasets[0].data = [{month: "March", amount: 100}, {month: "April", amount: 200}];
        chart.update();
        canvas.dispatchEvent(new Event("focus"));

        expect(parent.children[1].textContent).toContain('X is "" from March to April.');
        expect(parent.children[1].textContent).toContain('Y is "" from 100 to 200.');
        chart.destroy();
    });

    test("reports unsupported parsing configurations", () => {
        const {canvas} = createCanvas();
        const errorCallback = jest.fn();
        const chart = new Chart(canvas, {
            type: "bar",
            data: {datasets: [{data: [{period: "January", amount: 12}]}]},
            options: {
                parsing: {xAxisKey: "period"},
                plugins: {chartjs2music: {errorCallback}}
            }
        } as any);

        expect(errorCallback).toHaveBeenCalledWith(expect.stringContaining("xAxisKey and yAxisKey"));
        chart.destroy();
    });
});
