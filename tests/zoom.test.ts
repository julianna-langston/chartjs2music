import {
    CategoryScale,
    Chart,
    LineController,
    LineElement,
    LinearScale,
    PointElement
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import plugin from "../src/c2m-plugin";

Chart.register(CategoryScale, LineController, LineElement, LinearScale, PointElement, zoomPlugin, plugin);

jest.useFakeTimers();

const createChart = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const cc = document.createElement("div");
    const onFocusCallback = jest.fn();
    const chart = new Chart(canvas, {
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{label: "Revenue", data: [28, 42, 35, 56, 49, 65, 73, 68, 82, 77, 91, 88]}]
        },
        options: {
            responsive: false,
            plugins: {
                chartjs2music: {cc, options: {enableSound: false, onFocusCallback}},
                zoom: {
                    limits: {
                        x: {min: "original", max: "original", minRange: 2},
                        y: {min: 0, max: 100, minRange: 10}
                    },
                    pan: {enabled: true, mode: "xy"},
                    zoom: {mode: "xy", wheel: {enabled: true}, pinch: {enabled: true}}
                }
            },
            scales: {
                x: {title: {display: true, text: "Month"}},
                y: {min: 0, max: 100, title: {display: true, text: "Revenue"}}
            }
        }
    });
    return {canvas, cc, chart, onFocusCallback};
}

const keydown = (canvas: HTMLCanvasElement, key: string, options: KeyboardEventInit) => {
    const event = new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true, ...options});
    canvas.dispatchEvent(event);
    jest.advanceTimersByTime(250);
    return event;
}

describe("chartjs-plugin-zoom integration", () => {
    test("Ctrl/Cmd zoom shortcuts prevent browser zoom and announce the visible axes", () => {
        const {canvas, cc, chart, onFocusCallback} = createChart();
        const originalMaximum = chart.scales.x.max;

        const zoomIn = keydown(canvas, "+", {ctrlKey: true});

        expect(zoomIn.defaultPrevented).toBe(true);
        expect(chart.scales.x.max).toBeLessThan(originalMaximum);
        expect(cc.textContent).toContain("Zoomed in.");
        expect(cc.textContent).toContain('X axis "Month"');
        expect(cc.textContent).toContain('Y axis "Revenue"');

        canvas.dispatchEvent(new Event("focus"));
        expect(onFocusCallback).toHaveBeenLastCalledWith(expect.objectContaining({
            point: expect.objectContaining({x: expect.any(Number)})
        }));
        expect(onFocusCallback.mock.lastCall?.[0].point.x).toBeGreaterThanOrEqual(chart.scales.x.min);

        for(let index = 0; index < 12; index++){
            keydown(canvas, "ArrowRight", {});
        }
        const announcedXValues = onFocusCallback.mock.calls.map(([event]) => event.point.x);
        expect(announcedXValues.every((value) => value >= chart.scales.x.min && value <= chart.scales.x.max)).toBe(true);

        const zoomOut = keydown(canvas, "-", {ctrlKey: true});
        expect(zoomOut.defaultPrevented).toBe(true);
        expect(cc.textContent).toContain("Zoomed out.");

        const reset = keydown(canvas, "0", {metaKey: true});
        expect(reset.defaultPrevented).toBe(true);
        expect(chart.scales.x.max).toBe(originalMaximum);
        expect(cc.textContent).toContain("Zoom reset.");
        chart.destroy();
    });

    test("Alt+Shift arrows pan by axis and announce edges", () => {
        const {canvas, cc, chart} = createChart();
        keydown(canvas, "+", {ctrlKey: true});
        const minimumAfterZoom = chart.scales.x.min;

        const right = keydown(canvas, "ArrowRight", {altKey: true, shiftKey: true});
        expect(right.defaultPrevented).toBe(true);
        expect(chart.scales.x.min).toBeGreaterThan(minimumAfterZoom);
        expect(cc.textContent).toContain("Panning right.");
        expect(cc.textContent).toContain('X axis "Month"');

        const up = keydown(canvas, "ArrowUp", {altKey: true, shiftKey: true});
        expect(up.defaultPrevented).toBe(true);
        expect(cc.textContent).toContain("Panning up.");
        expect(cc.textContent).toContain('Y axis "Revenue"');

        keydown(canvas, "0", {ctrlKey: true});
        keydown(canvas, "ArrowLeft", {altKey: true, shiftKey: true});
        expect(cc.textContent).toContain("left edge.");
        chart.destroy();
    });
});
