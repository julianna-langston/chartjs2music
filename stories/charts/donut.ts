import type {ChartData, ChartOptions, ChartTypeRegistry} from "chart.js";

// https://www.chartjs.org/docs/latest/configuration/canvas-background.html

const data: ChartData = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

export default {
  type: 'doughnut' as keyof ChartTypeRegistry,
  data,
}
