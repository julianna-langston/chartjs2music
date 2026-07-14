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
    plugins: {
      title: {display: true, text: "Favorite Color"},
      legend: {display: false}
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          text: "Votes",
          display: true
        }
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
