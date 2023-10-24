import type {ChartTypeRegistry} from "chart.js";

const config=  {
    type: "bar" as keyof ChartTypeRegistry,
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    }
};

export default config;