// https://www.chartjs.org/docs/latest/axes/cartesian/category.html

import { ChartTypeRegistry } from "chart.js";

export default {
  type: 'line' as keyof ChartTypeRegistry,
  data: {
      datasets: [{
          data: [10, 20, 30, 40, 50, 60]
      }],
      labels: ['January', 'February', 'March', 'April', 'May', 'June']
  },
  options: {
      scales: {
          x: {
              min: 'March'
          }
      }
  }
};