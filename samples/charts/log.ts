// https://www.chartjs.org/docs/latest/samples/scales/log.html

import { ChartOptions, ChartTypeRegistry } from "chart.js";

const labels = ["January", "February", "March", "April", "May", "June", "July"]
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [50, 1000, 50000, 20000, 150, 90000, 10],
      borderColor: "red",
      backgroundColor: "red",
      fill: false,
    },
  ]
};

const options: ChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: ['Chart.js Line Chart', "Logarithmic"]
    }
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
      type: 'logarithmic',
    }
  }
};

const config = {
  type: 'line' as keyof ChartTypeRegistry,
  data: data,
  options,
};

export default config;