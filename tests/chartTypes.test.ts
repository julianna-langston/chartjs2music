import {Chart, ChartConfiguration} from "chart.js";
import plugin from "../src/c2m-plugin";
import charts from "../samples/charts"

const {
    simple_bar, 
    grouped_bar, 
    grouped_line,
    polarArea1,
    donut,
    stacked_pie,
    box_plot,
    box_plot_numbers,
    box_plot_group,
    box_plot_group_numbers,
    wordcloud
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

test("Bar chart", () => {
    const {cc} = setup(simple_bar);

    expect(cc.textContent).toContain(`Sonified bar chart "Test"`);
    expect(cc.textContent).toContain(`x is "Year" from 2010 to 2016`);
    expect(cc.textContent).toContain(`y is "Count" from 10 to 30`);
});
test("Floating Grouped bar chart", () => {
    const {cc} = setup(grouped_bar);

    expect(cc.textContent).toContain(`Sonified bar chart "Chart.js Bar Chart", contains 2 groups`);
    expect(cc.textContent).toContain(`x is "" from January to July`);
    expect(cc.textContent).toContain(`y is "" from -62 to 100`);
});
test("Grouped line chart", () => {
    const {cc} = setup(grouped_line);

    expect(cc.textContent).toContain(`Sonified line chart "Chart.js Line Chart", contains 2 groups`);
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

    expect(cc.textContent).toContain(`Sonified pie chart "", contains 4 groups`);
    expect(cc.textContent).toContain(`x is "" from Overall Yay to Overall Nay`);
    expect(cc.textContent).toContain(`y is "" from 10 to 90`);
});
test("Box plot", () => {
    // @ts-ignore
    const {cc} = setup(box_plot);
    
    expect(cc.textContent).toContain(`Sonified box chart "City Mileage for Vehicle Types"`);
    expect(cc.textContent).toContain(`x is "" from SUV to Hybrid`);
    expect(cc.textContent).toContain(`y is "" from 10 to 60`);
});
test("Box plot (numbers)", () => {
    // @ts-ignore
    const {cc} = setup(box_plot_numbers);
    
    expect(cc.textContent).toContain(`Sonified box chart "Iris"`);
    expect(cc.textContent).toContain(`x is "" from Setosa to Virginica`);
    expect(cc.textContent).toContain(`y is "" from 4.3 to 7.7`);
});
test("Grouped box plot", () => {
    // @ts-ignore
    const {cc} = setup(box_plot_group);
    
    expect(cc.textContent).toContain(`Sonified box chart "Iris", contains 3 groups`);
    expect(cc.textContent).toContain(`x is "" from Sepal Length to Petal width`);
    expect(cc.textContent).toContain(`y is "" from 0.1 to 7.7`);
});
test("Grouped box plot (numbers)", () => {
    // @ts-ignore
    const {cc} = setup(box_plot_group_numbers);
    
    expect(cc.textContent).toContain(`Sonified box chart "Iris", contains 3 groups`);
    expect(cc.textContent).toContain(`x is "" from Sepal Length to Petal width`);
    expect(cc.textContent).toContain(`y is "" from 0.1 to 7.9`);
});
test("Word cloud", () => {
    // @ts-ignore
    const {cc} = setup(wordcloud);
    
    expect(cc.textContent).toContain(`Sonified bar chart "Word Cloud Examples"`);
    expect(cc.textContent).toContain(`x is "Word" from Hello to this`);
    expect(cc.textContent).toContain(`y is "Emphasis" from 10 to 90`);
});


/*
To Do:
    Line chart
    pie chart
    grouped donut chart
*/