import {Chart} from "chart.js";
import plugin from "../src/c2m-plugin";
import samples from "../samples/charts"

const {simple_bar} = samples;

Chart.register(plugin);

test("Chart2Music options are passed through via plugin options", () => {
    const mockElement = document.createElement("canvas");
    const onSelectCallback = jest.fn();

    new Chart(mockElement, {
        ...simple_bar,
        options: {
            ...simple_bar.options,
            plugins: {
                ...simple_bar.options?.plugins,
                chartjs2music: {
                    // @ts-ignore
                    options: {
                        onSelectCallback,
                        enableSound: false
                    }
                }
            }
        }
    });

    // Verify chart was created
    expect(mockElement.getAttribute("tabIndex")).toBe("0");

    // TODO: Test that onSelectCallback actually gets called
    // This would require simulating Chart2Music interaction which is beyond
    // the scope of this minimal test - just verifying the option is accepted
});

test("User's onFocusCallback works alongside plugin's internal callback", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    const userOnFocusCallback = jest.fn();

    const chart = new Chart(mockElement, {
        ...simple_bar,
        options: {
            ...simple_bar.options,
            plugins: {
                ...simple_bar.options?.plugins,
                chartjs2music: {
                    // @ts-ignore
                    options: {
                        onFocusCallback: userOnFocusCallback
                    }
                }
            }
        }
    });

    // Apply focus to trigger callbacks
    mockElement.dispatchEvent(new Event("focus"));

    // User's callback should have been called
    expect(userOnFocusCallback).toHaveBeenCalled();

    // Plugin's internal callback should have worked (CC element updated)
    expect(mockParent.children[1].textContent).toContain(`Sonified chart`);
});
