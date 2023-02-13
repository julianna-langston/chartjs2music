import {Chart} from "chart.js";
import {plugin} from "../src/c2m-plugin";
import charts from "../samples/charts"

Chart.register(plugin);

test("C2M Plugin modifies source canvas element", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    expect(mockParent.childElementCount).toBe(1);
    new Chart(mockElement, charts[0]);

    // Canvas now has tabIndex=0
    expect(mockElement.getAttribute("tabIndex")).toBe("0");

    // Canvas now has an aria-label
    expect(mockElement.hasAttribute("aria-label")).toBeTruthy();
    
    // Canvas now has a role
    expect(mockElement.hasAttribute("role")).toBeTruthy();

    // CC element was created, and is the next sibling of the canvas element
    expect(mockParent.childElementCount).toBe(2);

    // CC element is empty
    expect(mockParent.children[1].textContent).toBe("");
    
    // Apply focus to the canvas element
    mockElement.dispatchEvent(new Event("focus"));

    // CC element has been updated with details.
    expect(mockParent.children[1].textContent).toContain(`Sonified bar chart "Test"`);
    expect(mockParent.children[1].textContent).toContain(`x is "Year" from 2010 to 2016`);
    expect(mockParent.children[1].textContent).toContain(`y is "Count" from 10 to 30`);
});

test("Providing a CC element as part of the C2M plugin options", () => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    const mockCC = document.createElement("div");
    expect(mockParent.childElementCount).toBe(1);
    new Chart(mockElement, {
        ...charts[0],
        options: {
            // @ts-ignore
            ...charts[0].options,
            plugins: {
                // @ts-ignore
                ...charts[0].options.plugins,
                chartjs2music: {
                    cc: mockCC
                }
            }
        }
    });

    // CC element was created, and is the next sibling of the canvas element
    expect(mockParent.childElementCount).toBe(1);
    
    // Apply focus to the canvas element
    mockElement.dispatchEvent(new Event("focus"));

    expect(mockCC.textContent).toContain(`Sonified bar chart "Test"`)

});