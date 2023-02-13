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
    stacked_pie
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

test("Bar chart", () => {
    const {cc} = setup(simple_bar);

    expect(cc.textContent).toContain(`Sonified bar chart "Test"`);
    expect(cc.textContent).toContain(`x is "Year" from 2010 to 2016`);
    expect(cc.textContent).toContain(`y is "Count" from 10 to 30`);
});
test("Floating Grouped bar chart", () => {
    const {cc} = setup(grouped_bar);

    expect(cc.textContent).toContain(`Sonified bar chart "Chart.js Bar Chart", contains 2 categories`);
    expect(cc.textContent).toContain(`x is "" from January to July`);
    expect(cc.textContent).toContain(`y is "" from -62 to 100`);
});
test("Grouped line chart", () => {
    const {cc} = setup(grouped_line);

    expect(cc.textContent).toContain(`Sonified line chart "Chart.js Line Chart", contains 2 categories`);
    expect(cc.textContent).toContain(`x is "" from January to July`);
    expect(cc.textContent).toContain(`y is "" from -62 to 100`);
});
test("Polar area", () => {
    const {cc} = setup(polarArea1);

    expect(cc.textContent).toContain(`Sonified bar chart ""`);
    expect(cc.textContent).toContain(`x is "" from Label 0 to Label 99`);
    // y values are randomly generated, so we're not going to check up on them
});
test("Donut chart", () => {
    const {cc} = setup(donut);

    expect(cc.textContent).toContain(`Sonified pie chart ""`);
    expect(cc.textContent).toContain(`x is "" from Red to Yellow`);
    expect(cc.textContent).toContain(`y is "" from 50 to 300`);
});
test("Grouped pie chart", () => {
    const {cc} = setup(stacked_pie);

    expect(cc.textContent).toContain(`Sonified pie chart "", contains 4 categories`);
    expect(cc.textContent).toContain(`x is "" from Overall Yay to Overall Nay`);
    expect(cc.textContent).toContain(`y is "" from 10 to 90`);
});


/*
To Do:
    Line chart
    pie chart
    grouped donut chart
*/