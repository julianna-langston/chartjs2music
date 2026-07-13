# chartjs-plugin-chart2music

[![npm version](https://badge.fury.io/js/chartjs-plugin-chart2music.svg)](https://www.npmjs.com/package/chartjs-plugin-chart2music)

`chartjs-plugin-chart2music` connects [Chart.js](https://www.chartjs.org/) charts to [Chart2Music](https://chart2music.com/), providing keyboard navigation, screen-reader output, and interactive data sonification. Focus a chart to explore its data with the keyboard; the active data point is also highlighted on the visual chart.

This plugin is in beta. The supported chart types and integration points are listed below.

## Install and use

```bash
npm install chart.js chartjs-plugin-chart2music
```

Register the plugin globally:

```js
import Chart from "chart.js/auto";
import chart2music from "chartjs-plugin-chart2music";

Chart.register(chart2music);

new Chart(canvasElement, {
    type: "bar",
    data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{label: "Revenue", data: [1, 4, 2, 8]}]
    }
});
```

Or add it to one chart only:

```js
new Chart(canvasElement, {
    type: "bar",
    data: {
        datasets: [{data: [1, 4, 2, 8]}]
    },
    plugins: [chart2music]
});
```

When no `cc` element is supplied, the plugin creates a caption element immediately after the canvas. Supply your own element when you need to control where the Chart2Music output appears.

## Plugin options

Configure the plugin through `options.plugins.chartjs2music`:

```js
new Chart(canvasElement, {
    type: "bar",
    data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{label: "Revenue", data: [1, 4, 2, 8]}]
    },
    options: {
        plugins: {
            chartjs2music: {
                cc: outputElement,
                lang: "en",
                axes: {
                    x: {label: "Quarter"},
                    y: {
                        label: "Revenue",
                        format: (value) => `$${value.toLocaleString()}`
                    }
                },
                options: {
                    enableSound: true,
                    onFocusCallback: (point) => console.log(point),
                    onSelectCallback: ({point}) => console.log(point)
                },
                errorCallback: console.error
            }
        }
    }
});
```

Available plugin options:

- `cc`: Element that receives Chart2Music's accessible chart caption. Optional.
- `lang`: Chart2Music language. Supported values include `en`, `de`, `es`, `fr`, and `it`; default is `en`.
- `axes`: Chart2Music axis configuration, including labels and value formatters.
- `audioEngine`: A custom Chart2Music audio engine.
- `options`: Chart2Music interaction options such as `enableSound`, `onFocusCallback`, and `onSelectCallback`.
- `errorCallback`: Receives errors while the plugin initializes or updates a chart.

## Supported charts

The plugin supports Chart.js bar, line, pie, doughnut, polar area, and scatter charts, including mixed bar/line configurations. It also supports:

- Box plots from [`@sgratzl/chartjs-chart-boxplot`](https://www.npmjs.com/package/@sgratzl/chartjs-chart-boxplot).
- Bar charts with error bars from [`chartjs-chart-error-bars`](https://www.npmjs.com/package/chartjs-chart-error-bars).
- Matrix plots from [`chartjs-chart-matrix`](https://www.npmjs.com/package/chartjs-chart-matrix).
- Word clouds from [`chartjs-chart-wordcloud`](https://www.npmjs.com/package/chartjs-chart-wordcloud).
- Chart titles, axis titles, minimum and maximum values, linear and logarithmic axes, custom axis formatting, dataset visibility, and chart data updates.

Visual-only Chart.js settings such as color, padding, and line thickness do not affect the sonification. Advanced Chart.js parsing configurations and nonstandard axis identifiers are not currently supported.

## Future support

Planned support includes:

- Chart subtitles.
- Radar plots.
- Parallel coordinate plots via [`chartjs-chart-pcp`](https://www.npmjs.com/package/chartjs-chart-pcp).
- Zoom interactions via [`chartjs-plugin-zoom`](https://www.npmjs.com/package/chartjs-plugin-zoom).

## Examples and Storybook

The repository includes runnable chart configurations under [`stories/charts`](./stories/charts), covering the supported chart types and plugin integrations. A Storybook catalogue exposes these examples as Bar, Line, Multi-chart, Distribution, Circular, Scatter, Matrix, Word cloud, and Options stories.

```bash
npm run storybook
```

Build the static Storybook site with:

```bash
npm run build-storybook
```

More examples are available in the [CodePen collection](https://codepen.io/collection/VYEvEQ).

## Development

```bash
npm test
npm run build
npm run depcheck
```
