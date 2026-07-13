import { ChartTypeRegistry } from "chart.js";

export default {
    type: 'bar' as keyof ChartTypeRegistry,
    data: {
      datasets: [{
        data: [{x: 'Sales', y: 20}, {x: 'Revenue', y: 10}]
      }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        }
    }
  };