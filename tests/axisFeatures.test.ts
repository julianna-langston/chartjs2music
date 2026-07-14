import {Chart, ChartConfiguration} from "chart.js";
import plugin from "../src/c2m-plugin";
import charts from "../stories/charts"

const {
    simple_bar, 
    bar_line,
    getting_started_Example,
    floating_bar,
    string_x_minimum,
    string_x_values,
    grouped_scatter
} = charts;

Chart.register(plugin);

const setup = (config: ChartConfiguration) => {
    const mockParent = document.createElement("div");
    const mockElement = document.createElement("canvas");
    mockParent.appendChild(mockElement);
    new Chart(mockElement, config);
    mockElement.dispatchEvent(new Event("focus"));

    return {
        parent: mockParent,
        canvas: mockElement,
        cc: mockParent.children[1]
    }
}

test("Axis with label", () => {
    const {cc} = setup(getting_started_Example);

    expect(cc.textContent).toContain(`Sonified chart titled "Favorite Color"`);
    expect(cc.textContent).toContain(`X is "Color" from Red to Orange`);
    expect(cc.textContent).toContain(`Y is "Votes" from 2 to 19`);
});
test("Axis without label", () => {
    const {cc} = setup(bar_line);

    expect(cc.textContent).toContain(`X is "" from 1st yr to 6th yr.`);
    expect(cc.textContent).toContain(`Y is "" from 1 to 15.`);
});
test("Axis format is shared with Chart2Music", () => {
    const {cc} = setup(floating_bar);

    expect(cc.textContent).toContain(`Y is "Temperature" from 11\u00b0 to 103\u00b0`);
});
test("Axis formats use configured Chart.js tick callbacks", () => {
    const {cc} = setup({
        type: "bar",
        data: {
            labels: ["A", "B"],
            datasets: [{data: [1200, 2500]}]
        },
        options: {
            scales: {
                x: {ticks: {callback: (value) => `Category ${value}`}},
                y: {ticks: {callback: (value) => `$${Number(value).toFixed(2)}`}}
            }
        }
    });

    expect(cc.textContent).toContain(`X is "" from Category 0 to Category 1.`);
    expect(cc.textContent).toContain(`Y is "" from $1200.00 to $2500.00.`);
});
test("Chart2Music axis formats override Chart.js tick callbacks", () => {
    const {cc} = setup({
        type: "bar",
        data: {
            labels: ["A", "B"],
            datasets: [{data: [5, 10]}]
        },
        options: {
            plugins: {
                chartjs2music: {
                    axes: {y: {format: (value: number) => `C2M ${value}`}}
                }
            },
            scales: {
                y: {ticks: {callback: (value) => `Tick ${value}`}}
            }
        }
    });

    expect(cc.textContent).toContain(`Y is "" from C2M 5 to C2M 10.`);
});
test("Axis with hidden label", () => {
    const {cc} = setup(simple_bar);

    expect(cc.textContent).toContain(`X is "Year" from 2010 to 2016`);
});
// test("Axis with explicit minimum", () => {
//     const {cc} = setup();

//     expect(cc.textContent).toContain();
// });
test("Axis with explicit minimum (string)", () => {
    const {cc} = setup(string_x_minimum);

    expect(cc.textContent).toContain(`X is "" from March to Jun`);
});
// test("Axis with explicit maximum", () => {
//     const {cc} = setup();

//     expect(cc.textContent).toContain();
// });
test("Axis with string values", () => {
    // @ts-ignore
    const {cc} = setup(string_x_values);

    expect(cc.textContent).toContain(`X is "" from Sales to Revenue`);
});
test("Axis correctly displays provided formats", () => {
    // @ts-ignore
    const {cc} = setup(grouped_scatter);

    expect(cc.textContent).toContain(`X is "State Area" from 68.3 to 665,384`);
});
