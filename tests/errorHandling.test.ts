import {Chart} from "chart.js";
import plugin from "../src/c2m-plugin";
import bubble from "../samples/charts/bubble";

Chart.register(plugin);

test("Warn for invalid chart types", () => {
    const errorMockFn = jest.fn(() => {});

    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    expect(mockParent.childElementCount).toBe(1);
    new Chart(mockElement, {
        ...bubble,
        options: {
            plugins: {
                // @ts-ignore
                chartjs2music: {
                    errorCallback: errorMockFn
                }
            }
        }
    });

    
    expect(errorMockFn.mock.calls).toHaveLength(1);
    // @ts-ignore
    expect(errorMockFn.mock.calls[0][0]).toBe(`Unable to connect chart2music to chart. The chart is of type \"bubble\", which is not one of the supported chart types for this plugin. This plugin supports: bar, line, pie, polarArea, doughnut, boxplot, radar, wordCloud, scatter`);
});
