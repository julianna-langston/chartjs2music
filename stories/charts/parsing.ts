import type {ChartConfiguration} from "chart.js";

export default {
    type: "line",
    data: {
        datasets: [{
            label: "Revenue",
            data: [
                {quarter: "Q1", results: {revenue: 125}},
                {quarter: "Q2", results: {revenue: 180}},
                {quarter: "Q3", results: {revenue: 155}},
                {quarter: "Q4", results: {revenue: 220}}
            ],
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.25)"
        }]
    },
    options: {
        parsing: {
            xAxisKey: "quarter",
            yAxisKey: "results.revenue"
        },
        plugins: {
            title: {
                display: true,
                text: "Quarterly Revenue"
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Quarter"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Revenue"
                }
            }
        }
    }
} satisfies ChartConfiguration<"line">;
