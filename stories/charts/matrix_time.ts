import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const days = Array.from({length: 28}, (_, index) => new Date(Date.UTC(2026, 0, index + 1)).toISOString().slice(0, 10));
const data: MatrixDataPoint[] = days.map((x, index) => ({
    x,
    y: (index % 7) + 1,
    v: 10 + (index * 7) % 40
})).filter((_point, index) => ![5, 12, 20].includes(index));

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Documentation time matrix",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                return `rgba(46, 139, 87, ${(10 + value) / 60})`;
            },
            borderColor: "rgb(25, 100, 70)",
            borderWidth: 1,
            width: ({chart}) => (chart.chartArea?.width ?? 530) / 4 - 1,
            height: ({chart}) => (chart.chartArea?.height ?? 140) / 7 - 1
        }]
    },
    options: {
        aspectRatio: 4,
        plugins: {
            title: {display: true, text: "Matrix Documentation: Time Scale"},
            legend: {display: false}
        },
        scales: {
            x: {type: "time", time: {unit: "week"}, offset: true, title: {display: true, text: "Date"}, grid: {display: false}},
            y: {offset: true, ticks: {stepSize: 1}, title: {display: true, text: "Day of Week"}, grid: {display: false}}
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
