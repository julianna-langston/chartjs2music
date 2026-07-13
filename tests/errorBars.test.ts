import {CategoryScale, Chart, LinearScale} from "chart.js";
import {BarWithErrorBar, BarWithErrorBarsController} from "chartjs-chart-error-bars";
import plugin from "../src/c2m-plugin";
import {convertErrorBarData, normalizeErrorBarBounds} from "../src/errorBars";
import errorBars from "../stories/charts/error_bars";

Chart.register(CategoryScale, LinearScale, BarWithErrorBarsController, BarWithErrorBar, plugin);

const createChart = (onFocusCallback: jest.Mock) => {
    const canvas = document.createElement("canvas");
    const chart = new Chart(canvas, {
        ...errorBars,
        options: {
            ...errorBars.options,
            plugins: {
                ...errorBars.options.plugins,
                chartjs2music: {
                    options: {onFocusCallback}
                }
            }
        }
    } as any);

    canvas.dispatchEvent(new Event("focus"));
    return {canvas, chart};
};

test("converts low-only, high-only, and two-sided bar error bounds", () => {
    expect(convertErrorBarData(errorBars.data.datasets[0].data)).toEqual([
        {x: 0, y: 12, low: 9, high: 12},
        {x: 1, y: 18, low: 18, high: 22},
        {x: 2, y: 15, low: 12, high: 19}
    ]);
});

test("fills missing display bounds for one-sided bar error values", () => {
    expect(normalizeErrorBarBounds(errorBars.data.datasets[0].data)).toEqual([
        {y: 12, yMin: 9, yMax: 12},
        {y: 18, yMin: 18, yMax: 22},
        {y: 15, yMin: 12, yMax: 19}
    ]);
});

test("passes normalized bar error bounds to Chart2Music", () => {
    const onFocusCallback = jest.fn();
    const {chart} = createChart(onFocusCallback);

    expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
        point: expect.objectContaining({x: 0, y: 12, low: 9, high: 12})
    }));
    expect(chart.data.datasets[0].data[0]).toEqual({y: 12, yMin: 9, yMax: 12});
    chart.destroy();
});

test("does not convert error bounds on scatter charts", () => {
    const onFocusCallback = jest.fn();
    const canvas = document.createElement("canvas");
    const chart = new Chart(canvas, {
        type: "scatter",
        data: {
            datasets: [{data: [{x: 1, y: 12, yMin: 9, yMax: 16}]}]
        },
        options: {
            plugins: {
                chartjs2music: {options: {onFocusCallback}}
            }
        }
    } as any);

    canvas.dispatchEvent(new Event("focus"));
    expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
        point: expect.objectContaining({x: 1, y: 12})
    }));
    expect(onFocusCallback.mock.calls[0][0].point).not.toHaveProperty("low");
    expect(onFocusCallback.mock.calls[0][0].point).not.toHaveProperty("high");
    chart.destroy();
});
