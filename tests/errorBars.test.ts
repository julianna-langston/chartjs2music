import {CategoryScale, Chart, LinearScale} from "chart.js";
import {BarWithErrorBar, BarWithErrorBarsController} from "chartjs-chart-error-bars";
import plugin from "../src/c2m-plugin";
import {convertErrorBarData} from "../src/errorBars";
import errorBars from "../stories/charts/error_bars";

Chart.register(CategoryScale, LinearScale, BarWithErrorBarsController, BarWithErrorBar, plugin);

const createChart = (onFocusCallback: jest.Mock) => {
    const canvas = document.createElement("canvas");
    const cc = document.createElement("div");
    const chart = new Chart(canvas, {
        ...errorBars,
        options: {
            ...errorBars.options,
            plugins: {
                ...errorBars.options.plugins,
                chartjs2music: {
                    cc,
                    options: {onFocusCallback}
                }
            }
        }
    } as any);

    canvas.dispatchEvent(new Event("focus"));
    return {canvas, chart, cc};
};

test("converts low-only, high-only, and two-sided bar error bounds", () => {
    expect(convertErrorBarData(errorBars.data.datasets[0].data)).toEqual([
        {x: 0, y: 12, low: 9, high: 12},
        {x: 1, y: 18, low: 18, high: 19},
        {x: 2, y: 15, low: 12, high: 19}
    ]);
});

test("calculates Chart2Music ranges without changing Chart.js error bars", () => {
    const onFocusCallback = jest.fn();
    const {chart, cc} = createChart(onFocusCallback);

    expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
        point: expect.objectContaining({x: 0, y: 12, low: 9, high: 12})
    }));
    expect(chart.data.datasets[0].data[0]).toEqual({y: 12, yMin: 9});
    expect(cc.textContent).toContain('Y is "Value" from 9 to 19');
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
