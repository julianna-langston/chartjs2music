import {CategoryScale, Chart, LinearScale} from "chart.js";
import {WordCloudController, WordElement} from "chartjs-chart-wordcloud";
import plugin from "../src/c2m-plugin";
import wordCloud from "../stories/charts/wordcloud";

Chart.register(CategoryScale, LinearScale, WordCloudController, WordElement, plugin);

test("does not update a word cloud when Chart2Music focus changes", () => {
    const canvas = document.createElement("canvas");
    const chart = new Chart(canvas, wordCloud as any);
    const update = jest.spyOn(chart, "update");

    canvas.dispatchEvent(new Event("focus"));

    expect(update).not.toHaveBeenCalled();
    chart.destroy();
});
