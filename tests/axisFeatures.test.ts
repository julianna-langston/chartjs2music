import {Chart, ChartConfiguration} from "chart.js";
import plugin from "../src/c2m-plugin";
import charts from "../samples/charts"

const [
    simple_bar, 
    log,
    grouped_bar, 
    grouped_line,
    floating_bar,
    bar_line,
    getting_started_Example,
    polarArea1,
    polarArea2,
    donut,
    string_x_minimum,
    stacked_pie,
    string_x_values
] = charts;

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

    expect(cc.textContent).toContain(`x is "Color" from Red to Orange`);
});
test("Axis without label", () => {
    const {cc} = setup(bar_line);

    expect(cc.textContent).toContain(`x is "" from 1st yr to 6th yr, y is "" from 1 to 15`);
});
test("Axis with hidden label", () => {
    const {cc} = setup(simple_bar);

    expect(cc.textContent).toContain(`x is "Year" from 2010 to 2016`);
});
// test("Axis with explicit minimum", () => {
//     const {cc} = setup();

//     expect(cc.textContent).toContain();
// });
test("Axis with explicit minimum (string)", () => {
    const {cc} = setup(string_x_minimum);

    expect(cc.textContent).toContain(`x is "" from March to Jun`);
});
// test("Axis with explicit maximum", () => {
//     const {cc} = setup();

//     expect(cc.textContent).toContain();
// });
test("Axis with string values", () => {
    const {cc} = setup(string_x_values);

    expect(cc.textContent).toContain(`x is "" from Sales to Revenue`);
})