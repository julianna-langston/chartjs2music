import type {ChartTypeRegistry} from "chart.js";

const data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
    ];
    const config=  {
            type: "bar" as keyof ChartTypeRegistry,
            data: {
                labels: data.map(row => `${row.year}`),
                datasets: [{
                    data: data.map(row => row.count)
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Test"
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            text: "Year"
                        }
                    },
                    y: {
                        title: {
                            text: "Count",
                            display: false
                        }
                    }
                }
            },
        };

        

export default config;