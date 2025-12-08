import {
    Chart,
    CategoryScale,
    LineController,
    PointElement,
    LineElement,
    BarController,
    LinearScale,
    BarElement,
} from "chart.js";
import plugin from "../src/c2m-plugin";

Chart.register(
    plugin,
    CategoryScale,
    LineController,
    PointElement,
    LineElement,
    BarController,
    LinearScale,
    BarElement,
);

jest.useFakeTimers();
window.AudioContext = jest.fn().mockImplementation(() => {
    return {};
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Dynamic Data Updates - Chart2Music State", () => {
    test("Chart2Music data should update when chart data changes", () => {
        const mockElement = document.createElement("canvas");
        const mockCC = document.createElement("div");

        const chart = new Chart(mockElement, {
            type: "bar",
            data: {
                labels: ["A", "B", "C"],
                datasets: [{
                    label: "Sales",
                    data: [10, 20, 30]
                }]
            },
            options: {
                plugins: {
                    chartjs2music: {
                        cc: mockCC
                    }
                }
            }
        });

        // Initial render - Chart2Music should have initial data
        chart.update();
        jest.advanceTimersByTime(250);

        // Focus to trigger Chart2Music announcement
        mockElement.dispatchEvent(new Event("focus"));

        const initialContent = mockCC.textContent || "";
        // Should contain initial values (10, 20, 30)
        expect(initialContent).toContain("10");

        // Now update the data
        chart.data.datasets[0].data = [100, 200, 300];
        chart.update();
        jest.advanceTimersByTime(250);

        // Re-focus to get updated announcement
        mockElement.dispatchEvent(new Event("blur"));
        mockElement.dispatchEvent(new Event("focus"));

        const updatedContent = mockCC.textContent || "";

        // THE FAILURE: Chart2Music should now announce the NEW values (100, 200, 300)
        // but it will still have the OLD values (10, 20, 30) because setData wasn't called
        expect(updatedContent).toContain("100 to");
        expect(updatedContent).not.toContain("10 to");

        chart.destroy();
    });

    test("Chart2Music should reflect appended data points", () => {
        const mockElement = document.createElement("canvas");
        const mockCC = document.createElement("div");

        const chart = new Chart(mockElement, {
            type: "line",
            data: {
                labels: ["Jan", "Feb"],
                datasets: [{
                    label: "Temperature",
                    data: [20, 25]
                }]
            },
            options: {
                plugins: {
                    chartjs2music: {
                        cc: mockCC
                    }
                }
            }
        });

        chart.update();
        jest.advanceTimersByTime(250);

        // Append new data
        chart.data.labels?.push("Mar");
        chart.data.labels?.push("Apr");
        chart.data.datasets[0].data.push(30);
        chart.data.datasets[0].data.push(35);
        chart.update();
        jest.advanceTimersByTime(250);

        // Focus to get announcement
        mockElement.dispatchEvent(new Event("focus"));

        const content = mockCC.textContent || "";

        // THE FAILURE: Should show 4 data points, but will show 2
        // because Chart2Music wasn't updated with new data
        expect(content).toContain("Apr");

        chart.destroy();
    });

    test("Chart2Music should update when dataset values change", () => {
        const mockElement = document.createElement("canvas");
        const mockCC = document.createElement("div");

        const chart = new Chart(mockElement, {
            type: "line",
            data: {
                labels: ["Q1", "Q2"],
                datasets: [
                    {
                        label: "Series 1",
                        data: [5, 10]
                    },
                    {
                        label: "Series 2",
                        data: [15, 20]
                    }
                ]
            },
            options: {
                plugins: {
                    chartjs2music: {
                        cc: mockCC
                    }
                }
            }
        });

        chart.update();
        jest.advanceTimersByTime(250);

        // Update both datasets
        chart.data.datasets[0].data = [50, 100];
        chart.data.datasets[1].data = [150, 200];
        chart.update();
        jest.advanceTimersByTime(250);

        mockElement.dispatchEvent(new Event("focus"));

        const content = mockCC.textContent || "";

        // THE FAILURE: Should contain new values (50, 100, 150, 200)
        // but will contain old values (5, 10, 15, 20)
        expect(content).toContain("50");
        expect(content).toContain("200");
        expect(content).not.toContain("100");
        expect(content).not.toContain("150");

        chart.destroy();
    });
});
