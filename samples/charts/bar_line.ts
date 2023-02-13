import type {ChartData, ChartOptions, ChartTypeRegistry} from "chart.js";

// https://codepen.io/mountainash/pen/MWBaLvM

const data: ChartData = {
  labels: ['1st yr', '2nd yr', '3rd yr', '4th yr', '5th yr', '6th yr'],
  datasets: [
    {
      type: 'bar' as keyof ChartTypeRegistry,
      label: "Cumutive TAX Savings",
      data: [1, 3, 6, 9, 12, 15],
      borderColor: 'green',
    },
    {
      type: 'line' as keyof ChartTypeRegistry,
      label: 'Report Cost',
      data: [10, 10, 10, 10, 10, 10],
      borderWidth: 2,
      borderDash: [10, 5],
      borderColor: 'grey',
    },
  ]
}
const options: ChartOptions = {
  scales: {
    y: {
        beginAtZero: true
    }
  }
};

export default {
  data,
  options
} as any;