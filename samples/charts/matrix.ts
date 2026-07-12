import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["9 AM", "12 PM", "3 PM"];

const data: MatrixDataPoint[] = days.flatMap((day, x) => {
    return hours.map((hour, y) => ({
        x: day,
        y: hour,
        v: [12, 18, 9, 14, 20, 27, 22, 16, 19, 30, 25, 21, 11, 17, 23, 28, 15, 26, 31, 24][x * hours.length + y]
    }));
});

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Library visitors",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                const alpha = Math.min(0.85, 0.2 + value / 40);
                return `rgba(54, 162, 235, ${alpha})`;
            },
            borderColor: "rgb(255, 255, 255)",
            borderWidth: 1,
            width(context) {
                const chartArea = context.chart.chartArea;
                return chartArea ? chartArea.width / days.length - 1 : 40;
            },
            height(context) {
                const chartArea = context.chart.chartArea;
                return chartArea ? chartArea.height / hours.length - 1 : 40;
            }
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Library Visitors by Day and Time"
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: "category",
                labels: days,
                offset: true,
                title: {
                    display: true,
                    text: "Day"
                },
                grid: {
                    display: false
                }
            },
            y: {
                type: "category",
                labels: hours,
                offset: true,
                title: {
                    display: true,
                    text: "Time"
                },
                grid: {
                    display: false
                }
            }
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
