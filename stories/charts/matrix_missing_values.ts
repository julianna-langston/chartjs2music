import type {ChartConfiguration} from "chart.js";
import type {MatrixDataPoint} from "chartjs-chart-matrix";

const columns = ["A", "B", "C"];
const rows = ["X", "Y", "Z"];
const populatedCells: Array<[string, string]> = [["A", "X"], ["C", "X"], ["B", "Y"], ["A", "Z"]];

const data: MatrixDataPoint[] = populatedCells.map(([x, y]) => ({
    x,
    y,
    v: Math.floor(Math.random() * 100) + 1
}));

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Values",
            data,
            backgroundColor: "rgba(54, 162, 235, 0.65)",
            borderColor: "rgb(255, 255, 255)",
            borderWidth: 1,
            width(context) {
                const chartArea = context.chart.chartArea;
                return chartArea ? chartArea.width / columns.length - 1 : 40;
            },
            height(context) {
                const chartArea = context.chart.chartArea;
                return chartArea ? chartArea.height / rows.length - 1 : 40;
            }
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Missing Values"
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: "category",
                labels: columns,
                offset: true,
                title: {
                    display: true,
                    text: "Column"
                },
                grid: {
                    display: false
                }
            },
            y: {
                type: "category",
                labels: rows,
                offset: true,
                title: {
                    display: true,
                    text: "Row"
                },
                grid: {
                    display: false
                }
            }
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
