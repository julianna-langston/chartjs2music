# chartjs-plugin-chart2music
[![npm version](https://badge.fury.io/js/chartjs-plugin-chart2music.svg)](https://badge.fury.io/js/chartjs-plugin-chart2music)

**This is a beta release of this plugin. Not all chart.js features are supported yet.**

Turns your chart.js charts into music so the blind can hear data. This plugin will automatically add Chart2Music, an interactive sonification library, to your chart.js charts. The contents of the chart element will be modified to best support screen reader users, and the interactions will be visually synchronized to provide support for keyboard-only users.

[Check out our CodePen collection of examples using the plugin.](https://codepen.io/collection/VYEvEQ)

## Getting started

Add the chartjs2music plugin to your existing chart.js code like this:

```js
import {Chart} from "chart.js/auto";
import chartjs2music from "chartjs-plugin-chart2music";

Chart.register(chartjs2music);
```

That will register the plugin globally. Alternatively, if you only want to enable for a given chart, you can do this:

```js
import {Chart} from "chart.js/auto";
import chartjs2music from "chartjs-plugin-chart2music";

new Chart(canvasElement, {
    type: "bar",
    data: {
        datasets: [{
            data: [1,4,2,8]
        }]
    },
    plugins: [chartjs2music]
})

```

## Available options

The following plugin options are available:
* `errorCallback` - A callback that will return errors if any arise while the plugin works.
* `cc` - the equivalent of the [chart2music option `cc`](https://chart2music.com/docs/API/Config#axes)
* `audioEngine` - the equivalent of the [chart2music option `audioEngine`](https://chart2music.com/docs/API/Config#cc)
* `axes` - the equivalent of the [chart2music option `axes`](https://chart2music.com/docs/API/Config#axes)
* `lang` - the language your user speaks. The available languages that Chart2Music supports are: "en", "de", "es", "fr", "it". The default is "en". If you would like to add translations for another language, [Chart2Music is open to PRs](https://github.com/julianna-langston/chart2music).

Here's an example for providing options:
```js
import {Chart} from "chart.js/auto";
import chartjs2music from "chartjs-plugin-chart2music";

new Chart(canvasElement, {
    type: "bar",
    data: {
        datasets: [{
            data: [1,4,2,8]
        }]
    },
    options: {
        plugins: {
            chartjs2music: {
                // All errors should be logged as errors
                errorCallback: console.error,
                // Here's a div I made to be the CC
                cc: myDiv,
                // The Y values should all be money
                axes: {
                    y: {
                        format: (value) => "$" + value
                    }
                }
            }
        }
    },
    plugins: [chartjs2music]
});
```

If you are using TypeScript, replace the first 4 lines with this:
```ts
import {Chart, type ChartTypeRegistry} from "chart.js/auto";
import chartjs2music from "chartjs-plugin-chart2music";

new Chart(canvasElement, {
    type: "bar" as keyof ChartTypeRegistry,
```

## Supported features

This plugin is currently in beta, so not all of the chart.js features are currently supported.

A quick list of chart.js features we currently support includes:
* Chart types: bar, doughnut, line, pie, polar, radar, scatter, and combinations therein.
* Boxplots using the `@sgratzl/chartjs-chart-boxplot` plugin (only support boxplots when there are no other chart types present)
* Wordclouds using the `chartjs-chart-wordcloud` plugin
* Axes options: `title`, `min`, `max`, `type="linear"`, `type="logarithmic"`.
* Chart title
* Most data structures (not including `parsing` or non-standard axes identifiers)

Note that visual-specific chart features are ignored. This includes things like color, padding, line thickness, etc.

Things we plan to support in the future:
* Interactions and updates
* Other chart.js plugins
* Complex `parsing` options for data
* Date/Time support for axes
* Subtitle
* Dataset visibility (when you show/hide a category from the legend)
* Radar charts
* Custom formatting for axis tick values

Plugins we plan to support in the future:
* [chartjs-char-error-bars](https://www.npmjs.com/package/chartjs-chart-error-bars)
* [chartjs-chart-matrix](https://www.npmjs.com/package/chartjs-chart-matrix)
* [chartjs-chart-pcp](https://www.npmjs.com/package/chartjs-chart-pcp)
* [chartjs-plugin-zoom](https://www.npmjs.com/package/chartjs-plugin-zoom)
