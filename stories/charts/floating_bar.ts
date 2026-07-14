import type {ChartTypeRegistry} from "chart.js";

// Monthly extrema at Raleigh-Durham International Airport through July 10, 2026.
// Source: https://www.extremeweatherwatch.com/cities/raleigh/year-2026
const months = ["January", "February", "March", "April", "May", "June", "July"];
const formatDegrees = (value: number) => `${value}\u00b0`;

export default {
    type: "bar" as keyof ChartTypeRegistry,
    data: {
        labels: months,
        datasets: [{
            label: "Temperature",
            data: [[15, 76], [11, 74], [29, 89], [32, 93], [40, 97], [48, 103], [72, 103]],
            backgroundColor: "#c24e36"
        }]
    },
    options: {
        plugins: {
            title: {display: true, text: "Weather in Raleigh 2026"},
            legend: {display: false},
            chartjs2music: {
                axes: {y: {format: formatDegrees}}
            }
        },
        scales: {
            x: {title: {display: true, text: "Month"}},
            y: {
                title: {display: true, text: "Temperature"},
                ticks: {callback: (value) => formatDegrees(Number(value))}
            }
        }
    }
};
