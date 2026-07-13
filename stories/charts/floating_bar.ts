import type {ChartData, ChartOptions, ChartTypeRegistry} from "chart.js";

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data: ChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
            [90, -30],
            [-30, 20],
            [70, -50],
        ],
        backgroundColor: "red"
      },
      {
        label: 'Dataset 2',
        data: [
            [90, -30],
            [-30, 20],
            [70, -50],
        ],
        backgroundColor: "blue",
      },
    ]
  };
const options: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Floating Bar Chart'
    }
  }
};
  export default {
    type: 'bar' as keyof ChartTypeRegistry,
    data,
    options
  };