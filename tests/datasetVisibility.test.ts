import {
    Chart,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
} from "chart.js";
import plugin from "../src/c2m-plugin";

Chart.register(
    plugin,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
);

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

/**
 * Mock audio engine. Built for testing purposes.
 */
class MockAudioEngine {
    masterGain: number;

    constructor() {}

    playDataPoint(frequency: number, panning: number, duration: number): void {}
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Dataset visibility toggling", () => {
    test("Stacked bar chart: toggling dataset visibility maintains correct order", () => {
        const mockParent = document.createElement("div");
        const mockElement = document.createElement("canvas");
        mockParent.appendChild(mockElement);

        const chart = new Chart(mockElement, {
            type: "bar",
            data: {
                labels: ["A", "B", "C"],
                datasets: [
                    {
                        label: "Dataset 0",
                        data: [10, 20, 30],
                    },
                    {
                        label: "Dataset 1",
                        data: [15, 25, 35],
                    },
                    {
                        label: "Dataset 2",
                        data: [20, 30, 40],
                    },
                ],
            },
            options: {
                scales: {
                    x: { stacked: true },
                    y: { stacked: true },
                },
                plugins: {
                    // @ts-ignore
                    chartjs2music: {
                        audioEngine: new MockAudioEngine(),
                    },
                },
            },
        });

        // Focus on the chart to initialize Chart2Music
        mockElement.dispatchEvent(new Event("focus"));

        // Navigate to first data point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        // Initial state: all datasets visible, should highlight all 3
        let activeElements = chart.getActiveElements();
        expect(activeElements.map((el) => el.datasetIndex)).toEqual([0, 1, 2]);

        // Hide dataset at index 1
        chart.hide(1);
        chart.update();

        // Navigate again to refresh highlights
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" })
        );
        jest.advanceTimersByTime(250);
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        // After hiding, should only highlight visible datasets [0, 2]
        activeElements = chart.getActiveElements();
        expect(activeElements.map((el) => el.datasetIndex)).toEqual([0, 2]);

        // Show dataset 1 again
        chart.show(1);
        chart.update();

        // Navigate again to refresh highlights
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" })
        );
        jest.advanceTimersByTime(250);
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        // After showing, should highlight all datasets in CORRECT order [0, 1, 2]
        // BUG: Currently returns [0, 2] because visible_groups array is in wrong order [0, 2, 1]
        // and only highlights the visible datasets
        activeElements = chart.getActiveElements();
        const afterShowOrder = activeElements.map((el) => el.datasetIndex);

        // THIS IS THE FAILING ASSERTION
        expect(afterShowOrder).toEqual([0, 1, 2]);
    });

    test("Stacked bar chart: hiding dataset 0 and showing it maintains order", () => {
        const mockParent = document.createElement("div");
        const mockElement = document.createElement("canvas");
        mockParent.appendChild(mockElement);

        const chart = new Chart(mockElement, {
            type: "bar",
            data: {
                labels: ["A", "B", "C"],
                datasets: [
                    {
                        label: "Dataset 0",
                        data: [10, 20, 30],
                    },
                    {
                        label: "Dataset 1",
                        data: [15, 25, 35],
                    },
                    {
                        label: "Dataset 2",
                        data: [20, 30, 40],
                    },
                ],
            },
            options: {
                scales: {
                    x: { stacked: true },
                    y: { stacked: true },
                },
                plugins: {
                    // @ts-ignore
                    chartjs2music: {
                        audioEngine: new MockAudioEngine(),
                    },
                },
            },
        });

        mockElement.dispatchEvent(new Event("focus"));

        // Navigate to first data point
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        // Initial state: all visible
        let activeElements = chart.getActiveElements();
        expect(activeElements.map((el) => el.datasetIndex)).toEqual([0, 1, 2]);

        // Hide dataset 0 (first one)
        chart.hide(0);
        chart.update();

        // Navigate to refresh
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" })
        );
        jest.advanceTimersByTime(250);
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        activeElements = chart.getActiveElements();
        expect(activeElements.map((el) => el.datasetIndex)).toEqual([1, 2]);

        // Show dataset 0 again
        chart.show(0);
        chart.update();

        // Navigate to refresh
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" })
        );
        jest.advanceTimersByTime(250);
        mockElement.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
        jest.advanceTimersByTime(250);

        // Should be back to [0, 1, 2], not [1, 2, 0]
        activeElements = chart.getActiveElements();
        expect(activeElements.map((el) => el.datasetIndex)).toEqual([0, 1, 2]);
    });

});
