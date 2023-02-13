import type {ChartTypeRegistry} from "chart.js";

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data = {
  labels,
  datasets: [
    {
      label: 'Fully Rounded',
      data: [60, 75, 2, -60, -62, 25, 100],
      backgroundColor: "red",
      borderWidth: 2,
      borderRadius: Number.MAX_VALUE,
      borderSkipped: false,
    },
    {
        label: "Normal",
      data: [55,80, 5, -40, -55, -55, 90],
      backgroundColor: "blue",
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false,
    }
  ]
};
export default {
    type: "bar" as keyof ChartTypeRegistry,
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as any,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    }
  }
};