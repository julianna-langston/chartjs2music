// https://www.chartjs.org/docs/latest/getting-started/

import { ChartTypeRegistry } from "chart.js";

export default {
  type: 'bar' as keyof ChartTypeRegistry,
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        title: {
          text: "Color",
          display: true
        }  
      }
    }
  }
};