import {CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement} from "chart.js";
import plugin from "../src/c2m-plugin";
import multiAxis from "../stories/charts/multi_axis";

Chart.register(CategoryScale, LineController, LineElement, LinearScale, PointElement, plugin);

test("uses custom scale IDs and exposes a secondary y axis", () => {
    const parent = document.createElement("div");
    const canvas = document.createElement("canvas");
    const onFocusCallback = jest.fn();
    parent.appendChild(canvas);

    const chart = new Chart(canvas, {
        ...multiAxis,
        options: {
            ...multiAxis.options,
            plugins: {
                ...multiAxis.options.plugins,
                chartjs2music: {options: {onFocusCallback}}
            }
        }
    } as any);

    chart.update();

    canvas.dispatchEvent(new Event("focus"));

    expect(parent.children[1].textContent).toContain('X is "Month" from January to March.');
    expect(parent.children[1].textContent).toContain('Y is "Revenue" from 120 to 180.');
    expect(onFocusCallback).toHaveBeenCalledWith(expect.objectContaining({
        point: expect.objectContaining({x: 0, y: 120})
    }));

    canvas.dispatchEvent(new KeyboardEvent("keydown", {key: "PageDown"}));
    expect(parent.children[1].textContent).toContain('Alternate Y is "Profit margin" from 18 to 24.');
    chart.destroy();
});

test("reports unsupported multiple x-axis assignments", () => {
    const canvas = document.createElement("canvas");
    const errorCallback = jest.fn();

    const chart = new Chart(canvas, {
        type: "line",
        data: {
            labels: ["January", "February"],
            datasets: [
                {label: "Revenue", data: [120, 180], xAxisID: "period", yAxisID: "revenue"},
                {label: "Forecast", data: [130, 190], xAxisID: "forecastPeriod", yAxisID: "revenue"}
            ]
        },
        options: {
            plugins: {chartjs2music: {errorCallback}},
            scales: {
                period: {axis: "x", type: "category"},
                forecastPeriod: {axis: "x", type: "category"},
                revenue: {axis: "y", type: "linear"}
            }
        }
    } as any);

    chart.update();

    expect(errorCallback).toHaveBeenCalledWith(expect.stringContaining("Multiple x-axis IDs are not supported"));
    chart.destroy();
});
