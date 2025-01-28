import type {ChartTypeRegistry} from "chart.js";

const formatter = new Intl.DateTimeFormat(undefined, {
    localeMatcher: "lookup",
    hour: "numeric",
    minute: "2-digit"
});
const sampleData = {
    theme: "light",
    chartData: {
        total: 31.46,
        series: [
            {
                name: "Total",
                data: [
                    { x: "1/28/2025, 2:01:13 PM", y: 0.73 },
                    { x: "1/28/2025, 2:04:13 PM", y: 0.73 },
                    { x: "1/28/2025, 2:05:13 PM", y: 0.73 },
                ]
            },
            {
                name: "Main Proc",
                data: [
                    { x: "1/28/2025, 2:01:13 PM", y: 0.19 },
                    { x: "1/28/2025, 2:04:13 PM", y: 0.19 },
                    { x: "1/28/2025, 2:05:13 PM", y: 0.19 }
                ]
            },
            {
                name: "Type A",
                data: [
                    { x: "1/28/2025, 2:01:13 PM", y: 0.48 },
                    { x: "1/28/2025, 2:04:13 PM", y: 0.48 },
                    { x: "1/28/2025, 2:05:13 PM", y: 0.48 },
                ]
            },
            {
                name: "Type B",
                data: [
                    { x: "1/28/2025, 2:01:13 PM", y: 0.03 },
                    { x: "1/28/2025, 2:04:13 PM", y: 0.03 },
                    { x: "1/28/2025, 2:05:13 PM", y: 0.03 },
                ]
            },
            {
                name: "Type C",
                data: [
                    { x: "1/28/2025, 2:01:13 PM", y: 0.43 },
                    { x: "1/28/2025, 2:04:13 PM", y: 0.44 },
                    { x: "1/28/2025, 2:05:13 PM", y: 0.45 },
                ]
            }
        ]
    }
};
const convertChartDataSeriesToChartjsDatasets = (chartDataSeries) => {
    return chartDataSeries.map(({name, data}) => {
        return {
            label: name,
            data: data.map(({x, y}) => {
                return {
                    x: new Date(x).valueOf(),
                    y
                }
            })
        }
    })
}

const config = {
    type: "line" as keyof ChartTypeRegistry,
    data: {
        datasets: convertChartDataSeriesToChartjsDatasets(sampleData.chartData.series)
    },
    options: {
        plugins: {
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.parsed.y * 100}%`
                    }
                }
            }
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    text: "Time",
                    display: false
                },
                type: "time",
                time: {
                    unit: "minute"
                },
                ticks: {
                    callback: (n) => {
                        return formatter.format(n);
                    }
                }
            },
            y: {
                title:{ 
                    text: "% of Memory Used",
                    display: false
                },
                min: 0,
                max: 1,
                ticks: {
                    callback: (n) => {
                        return `${n*100}%`
                    }
                }
            }
        }
    }
};

export default config;