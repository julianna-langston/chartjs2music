import plugin from "../c2m-plugin";
import { Chart, ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js/auto';
import {BoxPlotController, BoxAndWiskers} from "@sgratzl/chartjs-chart-boxplot";
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import legendPlugin from "chartjs-plugin-a11y-legend";
Chart.register(BoxPlotController, BoxAndWiskers, WordCloudController, WordElement, legendPlugin);

export type ChartProps = {
    type?: keyof ChartTypeRegistry;
    data: ChartData,
    options?: ChartOptions,
    updateData?: (chart: Chart) => boolean;
};

/**
 * Primary UI component for user interaction
 */
export const createChart = (c: ChartProps) => {
  const {updateData, ...config} = c;
  const newContainer = document.createElement("div");
  const canvas = document.createElement("canvas");
  newContainer.appendChild(canvas);

  const chart = new Chart(canvas, {
      ...config,
      options: {
          ...config.options,
          plugins: {
              ...config.options?.plugins,
              chartjs2music: {
                  ...config.options?.plugins?.chartjs2music,
                  cc: document.getElementById("cc"),
                  errorCallback: console.error
              }
          }
      },
      plugins: [plugin]
  });

  if(!updateData){
    return newContainer;
  }

  const button = document.createElement("button");
  button.textContent = "Update";
  button.addEventListener("click", () => {
      button.disabled = !(updateData(chart));
  });
  newContainer.appendChild(button);

  return newContainer;
};
