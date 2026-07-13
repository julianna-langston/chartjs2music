import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const columns = ["A", "B", "C"];
const rows = ["X", "Y", "Z"];
const data: MatrixDataPoint[] = columns.flatMap((x, column) => rows.map((y, row) => ({
    x,
    y,
    v: (column + 1) * 10 + row + 1
})));

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Documentation category matrix",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                return `rgba(30, 144, 255, ${(value - 5) / 40})`;
            },
            borderColor: "rgb(25, 90, 160)",
            borderWidth: 1,
            width: ({chart}) => (chart.chartArea?.width ?? 120) / columns.length - 1,
            height: ({chart}) => (chart.chartArea?.height ?? 120) / rows.length - 1
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Matrix Documentation: Category Scale"},
            legend: {display: false}
        },
        scales: {
            x: {type: "category", labels: columns, offset: true, title: {display: true, text: "Category"}, grid: {display: false}},
            y: {type: "category", labels: rows, offset: true, title: {display: true, text: "Group"}, grid: {display: false}}
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
