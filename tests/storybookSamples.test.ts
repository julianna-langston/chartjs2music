import errorBars from "../stories/charts/error_bars";
import log from "../stories/charts/log";
import donut from "../stories/charts/donut";
import polarAreaOne from "../stories/charts/polarArea1";
import polarAreaTwo from "../stories/charts/polarArea2";
import stackedPie from "../stories/charts/stacked_pie";
import boxPlot from "../stories/charts/box_plot";
import boxPlotNumbers from "../stories/charts/box_plot_numbers";
import boxPlotGroup from "../stories/charts/box_plot_group";
import boxPlotGroupNumbers from "../stories/charts/box_plot_group_numbers";

test("keeps the error-bar legend hidden", () => {
    expect(errorBars.options.plugins.legend.display).toBe(false);
});

test("formats logarithmic tooltips as dollars", () => {
    const label = (log.options.plugins?.tooltip as any).callbacks.label;
    expect(label({dataset: {label: "Dataset 1"}, parsed: {y: 1000}})).toBe("Dataset 1: $1,000");
});

test("limits all circular story canvases to the viewport height", () => {
    [donut, polarAreaOne, polarAreaTwo, stackedPie].forEach((sample) => {
        expect((sample as any).canvasMaxHeight).toBe("95vh");
    });
});

test("enables native tooltips on box plot samples", () => {
    [boxPlot, boxPlotNumbers, boxPlotGroup, boxPlotGroupNumbers].forEach((sample) => {
        expect((sample.options.plugins as any).tooltip.enabled).toBe(true);
    });
});
