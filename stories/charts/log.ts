// https://www.chartjs.org/docs/latest/samples/scales/log.html

import { ChartOptions, ChartTypeRegistry } from "chart.js";

const labels = ["January", "February", "March", "April", "May", "June", "July"]
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
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
    },
    chartjs2music: {
      axes: {
        y: {
          format: formatCurrency
        }
      }
    },
    tooltip: {
      callbacks: {label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`}
    }
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
      type: 'logarithmic',
      ticks: {
        callback: (value) => formatCurrency(Number(value))
      }
    }
  }
};

const config = {
  type: 'line' as keyof ChartTypeRegistry,
  data: data,
  options,
};

export default config;
