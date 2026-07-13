import type {ChartTypeRegistry} from "chart.js";

export default {
    type: "line" as keyof ChartTypeRegistry,
    data: {
        labels: ["January", "February", "March"],
        datasets: [{
            label: "Sales",
            data: [12, 19, 15],
            borderColor: "#2086d7"
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Monthly Sales"},
            subtitle: {display: true, text: "North America"}
        },
        scales: {
            x: {title: {display: true, text: "Month"}},
            y: {title: {display: true, text: "Sales"}}
        }
    }
};
