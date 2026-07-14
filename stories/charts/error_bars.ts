export default {
    type: "barWithErrorBars",
    data: {
        labels: ["Low only", "High only", "Both bounds"],
        datasets: [{
            label: "Forecast",
            data: [
                {y: 12, yMin: 9},
                {y: 18, yMax: 19},
                {y: 15, yMin: 12, yMax: 19}
            ],
            backgroundColor: "#2086d7"
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Forecast with Error Bars"
            },
            legend: {display: false}
        },
        scales: {
            x: {title: {display: true, text: "Scenario"}},
            y: {beginAtZero: true, title: {display: true, text: "Value"}}
        }
    }
};
