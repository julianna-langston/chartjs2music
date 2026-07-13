import type {ChartTypeRegistry} from "chart.js";

export default {
    type: "line" as keyof ChartTypeRegistry,
    data: {
        labels: ["January", "February", "March"],
        datasets: [
            {
                label: "Revenue",
                data: [120, 180, 150],
                xAxisID: "period",
                yAxisID: "revenue",
                borderColor: "#2086d7"
            },
            {
                label: "Profit margin",
                data: [18, 24, 21],
                xAxisID: "period",
                yAxisID: "margin",
                borderColor: "#1d8f5f"
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Revenue and Profit Margin"
            }
        },
        scales: {
            period: {
                axis: "x",
                type: "category",
                title: {display: true, text: "Month"}
            },
            revenue: {
                axis: "y",
                type: "linear",
                position: "left",
                title: {display: true, text: "Revenue"}
            },
            margin: {
                axis: "y",
                type: "linear",
                position: "right",
                title: {display: true, text: "Profit margin"},
                grid: {drawOnChartArea: false}
            }
        }
    }
};
