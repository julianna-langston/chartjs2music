import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const data: MatrixDataPoint[] = [
    {x: 1, y: 1, v: 11}, {x: 1, y: 2, v: 12}, {x: 1, y: 3, v: 13},
    {x: 2, y: 1, v: 21}, {x: 2, y: 2, v: 22}, {x: 2, y: 3, v: 23},
    {x: 3, y: 1, v: 31}, {x: 3, y: 2, v: 32}, {x: 3, y: 3, v: 33}
];

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Documentation basic matrix",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                return `rgba(34, 139, 34, ${(value - 5) / 40})`;
            },
            borderColor: "rgb(0, 100, 0)",
            borderWidth: 1,
            width: ({chart}) => (chart.chartArea?.width ?? 120) / 3 - 1,
            height: ({chart}) => (chart.chartArea?.height ?? 120) / 3 - 1
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Matrix Documentation: Basic Linear Scale"},
            legend: {display: false}
        },
        scales: {
            x: {title: {display: true, text: "Column"}, ticks: {stepSize: 1}, grid: {display: false}},
            y: {title: {display: true, text: "Row"}, offset: true, ticks: {stepSize: 1}, grid: {display: false}}
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
