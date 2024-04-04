import {
    Chart, 
    CategoryScale, 
    LogarithmicScale, 
    LineController,
    PointElement,
    LineElement,
    BarController,
    LinearScale,
    BarElement,
} from "chart.js";
import plugin from "../src/c2m-plugin";
import logChart from "../samples/charts/log";
import samples from "../samples/charts"

const {simple_bar} = samples;

Chart.register(
    plugin, 
    CategoryScale, 
    LogarithmicScale, 
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

/**
 * Info for play history
 */
type playHistoryType = {
    frequency: number;
    panning: number;
    duration: number;
};

let lastFrequency = 0;
let playHistory: playHistoryType[] = [];

/**
 * Mock audio engine. Built for testing purposes.
 */
class MockAudioEngine {
    masterGain: number;

    /**
     * Constructor
     */
    constructor() {
        lastFrequency = -10;
    }

    /**
     * The instructions to play a data point. The details are being recorded for the test system.
     *
     * @param frequency - hertz to play
     * @param panning - panning (-1 to 1) to play at
     * @param duration - how long to play
     */
    playDataPoint(frequency: number, panning: number, duration: number): void {
        lastFrequency = frequency;
        playHistory.push({ frequency, panning, duration });
    }
}

beforeEach(() => {
    playHistory = [];
    lastFrequency = -10;
});

test("Logarithmic axes", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, {
        ...logChart,
        options: {
            ...logChart.options,
            plugins: {
                ...logChart.options.plugins,
                // @ts-ignore
                chartjs2music: {
                    audioEngine: new MockAudioEngine()
                }
            }
        }
    });
    expect(playHistory).toHaveLength(0);
    mockElement.dispatchEvent(new Event("focus"));

    mockElement.dispatchEvent(new KeyboardEvent("keydown", {
        key: "ArrowRight"
    }));
    jest.advanceTimersByTime(250);

    expect(playHistory).toHaveLength(1);

    expect(lastFrequency).toBeCloseTo(466, -1); // would be 55 if a linear axis
});

test("Explicit minimum (number)", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                data: [11,12,13,14,15]
            }]
        },
        options: {
            scales: {
                x: {
                    min: 2
                }
            }
        }
    });

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockParent.children[1].textContent).toContain(`X is "" from C to E.`);

});

test("Explicit maximum (number)", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                data: [11,12,13,14,15]
            }]
        },
        options: {
            scales: {
                x: {
                    max: 3
                }
            }
        }
    });

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockParent.children[1].textContent).toContain(`X is "" from A to D.`);
});

test("Explicit maximum (number)", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                data: [11,12,13,14,15]
            }]
        },
        options: {
            scales: {
                x: {
                    max: "D"
                }
            }
        }
    });

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockParent.children[1].textContent).toContain(`X is "" from A to D.`);
});

test("Floating bar (non-grouped)", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                data: [
                    [11, 21],
                    [12, 22],
                    [13, 23],
                    [14, 24],
                    [15, 25],
                ]
            }]
        }
    });

    mockElement.dispatchEvent(new Event("focus"));
    expect(mockParent.children[1].textContent).toContain(`Sonified chart. Bar chart. X is "" from A to E. Y is "" from 11 to 25.`);
});

test("Empty chart (empty data)", () => {
    const mockElement = document.createElement("canvas");
    expect(() => {
        const chart = new Chart(mockElement, {
            type: "bar",
            data: {
                labels: ["A", "B", "C", "D", "E"],
                datasets: [{
                    data: []
                }]
            }
        });
        chart.data.datasets[0].data = [1,2,3,4];
        chart.update();
    }).not.toThrowError();
});
test("Empty chart (empty datasets)", () => {
    const mockElement = document.createElement("canvas");
    expect(() => {
        new Chart(mockElement, {
            type: "bar",
            data: {
                labels: ["A", "B", "C", "D", "E"],
                datasets: []
            }
        });
    }).not.toThrowError();
});

test("destroying chart", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    const mockCC = document.createElement("div");
    expect(mockParent.childElementCount).toBe(1);
    const chart = new Chart(mockElement, {
        ...simple_bar,
        options: {
            // @ts-ignore
            ...simple_bar.options,
            plugins: {
                // @ts-ignore
                ...simple_bar.options.plugins,
                // @ts-ignore
                chartjs2music: {
                    cc: mockCC
                }
            }
        }
    });

    expect(document.querySelectorAll("dialog")).toHaveLength(0);
    
    // Apply focus to the canvas element
    mockElement.dispatchEvent(new Event("focus"));
    mockElement.dispatchEvent(new KeyboardEvent("keydown", {
        key: "h"
    }));

    expect(document.querySelectorAll("dialog")).toHaveLength(1);

    chart.destroy();

    expect(document.querySelectorAll("dialog")).toHaveLength(0);

    new Chart(mockElement, {
        ...simple_bar,
        options: {
            // @ts-ignore
            ...simple_bar.options,
            plugins: {
                // @ts-ignore
                ...simple_bar.options.plugins,
                // @ts-ignore
                chartjs2music: {
                    cc: mockCC
                }
            }
        }
    });

    mockElement.dispatchEvent(new Event("focus"));
    mockElement.dispatchEvent(new KeyboardEvent("keydown", {
        key: "h"
    }));

    expect(document.querySelectorAll("dialog")).toHaveLength(1);
});