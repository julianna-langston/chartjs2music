import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const dates = Array.from({length: 28}, (_, index) => new Date(Date.UTC(2026, 1, index + 1)).toISOString().slice(0, 10));
const data: MatrixDataPoint[] = dates.map((y, index) => ({
    x: (index % 7) + 1,
    y,
    v: 8 + (index * 11) % 42
})).filter((_point, index) => ![3, 14, 25].includes(index));

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Documentation calendar matrix",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                return `rgba(186, 85, 211, ${(10 + value) / 60})`;
            },
            borderColor: "rgb(120, 45, 140)",
            borderWidth: 1,
            width: ({chart}) => (chart.chartArea?.width ?? 280) / 7 - 2,
            height: ({chart}) => (chart.chartArea?.height ?? 280) / 4 - 2
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Matrix Documentation: Calendar"},
            legend: {display: false}
        },
        scales: {
            x: {offset: true, ticks: {stepSize: 1}, title: {display: true, text: "Day of Week"}, grid: {display: false}},
            y: {type: "time", time: {unit: "week"}, offset: true, reverse: true, title: {display: true, text: "Week"}, grid: {display: false}}
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
