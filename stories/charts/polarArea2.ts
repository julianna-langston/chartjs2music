import type {ChartTypeRegistry} from "chart.js";

// https://codepen.io/nwi4/details/PoBmxKo

var data = new Array(100).fill(0);

export default {
  type: 'polarArea' as keyof ChartTypeRegistry,
  data: {
      labels: data.map((k, i) => 'Label ' + i),
      datasets: [{
          label: '# of Votes',
          data: data.map((k, i) => Math.random())
      }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 13
              }
            }
      }
    }
  }
};