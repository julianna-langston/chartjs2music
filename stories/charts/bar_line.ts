import type {Chart, ChartData, ChartOptions, ChartTypeRegistry} from "chart.js";

// https://codepen.io/mountainash/pen/MWBaLvM

const data: ChartData = {
  labels: ['1st yr', '2nd yr', '3rd yr', '4th yr', '5th yr', '6th yr'],
  datasets: [
    {
      type: 'bar' as keyof ChartTypeRegistry,
      label: "Cumutive TAX Savings",
      data: [1, 3, 6, 9, 12, 15],
      borderColor: 'green',
      backgroundColor: 'rgba(46, 139, 87, 0.55)',
    },
    {
      type: 'line' as keyof ChartTypeRegistry,
      label: 'Report Cost',
      data: [10, 10, 10, 10, 10, 10],
      borderWidth: 2,
      borderDash: [10, 5],
      borderColor: 'grey',
      backgroundColor: 'rgba(75, 75, 75, 0.4)',
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
  options,
  updateData: (chart: Chart) => {
    chart.data.datasets[0].data = chart.data.datasets[0].data.map((num) => (num as number) + 1);
    chart.update();
    return true;
  }
} as any;
