import type {ChartConfiguration} from "chart.js";

const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default {
    type: "line",
    data: {
        labels,
        datasets: [{
            label: "Monthly revenue",
            data: [28, 42, 35, 56, 49, 65, 73, 68, 82, 77, 91, 88],
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.25
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Monthly revenue"
            },
            zoom: {
                limits: {
                    x: {min: "original", max: "original", minRange: 2},
                    y: {min: 0, max: 100, minRange: 10}
                },
                pan: {
                    enabled: true,
                    mode: "xy",
                    modifierKey: "alt",
                    scaleMode: "xy",
                    overScaleMode: "xy",
                    threshold: 10,
                    onPan: () => {},
                    onPanComplete: () => {},
                    onPanRejected: () => {},
                    onPanStart: () => true
                },
                zoom: {
                    mode: "xy",
                    scaleMode: "xy",
                    overScaleMode: "xy",
                    wheel: {enabled: true, speed: 0.1, modifierKey: "ctrl"},
                    drag: {
                        enabled: true,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgb(54, 162, 235)",
                        borderWidth: 1,
                        drawTime: "beforeDatasetsDraw",
                        threshold: 5,
                        modifierKey: "shift",
                        maintainAspectRatio: false
                    },
                    pinch: {enabled: true},
                    onZoom: () => {},
                    onZoomComplete: () => {},
                    onZoomRejected: () => {},
                    onZoomStart: () => true
                }
            }
        },
        scales: {
            x: {title: {display: true, text: "Month"}},
            y: {min: 0, max: 100, title: {display: true, text: "Revenue"}}
        }
    }
} satisfies ChartConfiguration<"line">;
