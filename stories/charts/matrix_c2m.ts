import type { ChartConfiguration } from "chart.js";
import type { MatrixDataPoint } from "chartjs-chart-matrix";

const teams = ["Design", "Engineering", "Support", "Sales"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const completion = [72, 90, 64, 81, 88, 76, 94, 69, 57, 83, 71, 92, 79, 61, 86, 74];
const data: MatrixDataPoint[] = weeks.flatMap((x, week) => teams.map((y, team) => ({
    x,
    y,
    v: completion[week * teams.length + team]
})));

export default {
    type: "matrix",
    data: {
        datasets: [{
            label: "Task completion",
            data,
            backgroundColor(context) {
                const value = context.dataset.data[context.dataIndex]?.v ?? 0;
                return `rgba(255, 140, 0, ${0.15 + value / 120})`;
            },
            borderColor: "rgb(170, 85, 0)",
            borderWidth: 1,
            width: ({chart}) => (chart.chartArea?.width ?? 240) / weeks.length - 1,
            height: ({chart}) => (chart.chartArea?.height ?? 240) / teams.length - 1
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Chart2Music CodePen: Team Task Completion"},
            legend: {display: false}
        },
        scales: {
            x: {type: "category", labels: weeks, offset: true, title: {display: true, text: "Sprint"}, grid: {display: false}},
            y: {type: "category", labels: teams, offset: true, title: {display: true, text: "Team"}, grid: {display: false}}
        }
    }
} satisfies ChartConfiguration<"matrix", MatrixDataPoint[]>;
