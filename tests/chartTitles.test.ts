import {BarController, BarElement, CategoryScale, Chart, LinearScale} from "chart.js";
import plugin from "../src/c2m-plugin";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, plugin);

const createChart = (title?: string | string[], subtitle?: string | string[]) => {
    const canvas = document.createElement("canvas");
    const cc = document.createElement("div");
    const chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["January", "February"],
            datasets: [{label: "Sales", data: [10, 20]}]
        },
        options: {
            plugins: {
                chartjs2music: {cc},
                ...(title ? {title: {display: true, text: title}} : {}),
                ...(subtitle ? {subtitle: {display: true, text: subtitle}} : {})
            }
        }
    } as any);

    chart.update();
    canvas.dispatchEvent(new Event("focus"));
    return {canvas, cc, chart};
}

test("combines a chart title and subtitle", () => {
    const {cc, chart} = createChart("Annual Sales", "North America");
    expect(cc.textContent).toContain('Sonified chart titled "Annual Sales, North America".');
    chart.destroy();
});

test("uses a title or subtitle when only one is present", () => {
    const titled = createChart("Annual Sales");
    expect(titled.cc.textContent).toContain('Sonified chart titled "Annual Sales".');
    titled.chart.destroy();

    const subtitled = createChart(undefined, "North America");
    expect(subtitled.cc.textContent).toContain('Sonified chart titled "North America".');
    subtitled.chart.destroy();
});

test("joins multi-line subtitle text in order", () => {
    const {cc, chart} = createChart("Annual Sales", ["North America", "Preliminary"]);
    expect(cc.textContent).toContain('Sonified chart titled "Annual Sales, North America, Preliminary".');
    chart.destroy();
});

test("retains current behavior when title and subtitle are absent", () => {
    const {cc, chart} = createChart();
    expect(cc.textContent).toContain("Sonified chart. Bar chart.");
    chart.destroy();
});

test("refreshes the accessible description after a subtitle update", () => {
    const {canvas, cc, chart} = createChart("Annual Sales", "North America");
    (chart.options.plugins?.subtitle as any).text = "Europe";
    chart.update();
    canvas.dispatchEvent(new Event("focus"));

    expect(cc.textContent).toContain('Sonified chart titled "Annual Sales, Europe".');
    chart.destroy();
});
