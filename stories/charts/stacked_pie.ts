import type {ChartTypeRegistry} from "chart.js";

// https://www.chartjs.org/docs/latest/samples/other-charts/multi-series-pie.html
const DATA_COUNT = 5;
const data = {
  labels: ['Overall Yay', 'Overall Nay', 'Group A Yay', 'Group A Nay', 'Group B Yay', 'Group B Nay', 'Group C Yay', 'Group C Nay'],
  datasets: [
    {
      backgroundColor: ['#AAA', '#777'],
      data: [21, 79]
    },
    {
      backgroundColor: ['hsl(0, 100%, 60%)', 'hsl(0, 100%, 35%)'],
      data: [33, 67]
    },
    {
      backgroundColor: ['hsl(100, 100%, 60%)', 'hsl(100, 100%, 35%)'],
      data: [20, 80]
    },
    {
      backgroundColor: ['hsl(180, 100%, 60%)', 'hsl(180, 100%, 35%)'],
      data: [10, 90]
    }
  ]
};

const config = {
  type: 'pie' as keyof ChartTypeRegistry,
  data,
}

export default config;