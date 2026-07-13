import type {Chart, ChartTypeRegistry} from "chart.js";

const config = {
    type: "bar" as keyof ChartTypeRegistry,
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    }
};

export default {
    ...config,
    updateData: (chart: Chart) => {
        chart.data.labels = "ABCDE".split("");
        chart.data.datasets[0].data = [1,2,3,4,5];
        chart.update();
        console.log(chart);
        return false;
    }
};