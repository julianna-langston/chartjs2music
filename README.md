# chartjs-plugin-chart2music
chartjs plugin for chart2music.

**This is a beta release of this plugin**

Turns your chart.js charts into music so the blind can hear data. This plugin will automatically add Chart2Music, an interactive sonification library, to your chart.js charts. The contents of the chart element will be modified to best support screen reader users, and the interactions will be visually synchronized to provide support for keyboard-only users.

## Getting started

Add the chartjs2music plugin to your existing chart.js code like this:

```js
import {Chart} from "chart.js/auto";
import plugin from "chartjs-plugin-chart2music";

Chart.register(plugin);
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

## Supported features

This plugin is currently in beta, so not all of the chart.js features are currently supported.

A quick list of chart.js features we currently support includes:
* Chart types: bar, line, pie, doughnut, polar, and combinations therein.
* Axes options: `title`, `min`, `max`, `type="linear"`, `type="logarithmic"`.
* Chart title
* Most data structures (not including `parsing` or non-standard axes identifiers)
* Boxplots using the `@sgratzl/chartjs-chart-boxplot` plugin (only support boxplots when there are no other chart types present)

Note that visual-specific chart features are ignored. This includes things like color, padding, line thickness, etc.

Things we plan to support in the future:
* Interactions and updates
* Other chart.js plugins
* Complex `parsing` options for data
* Date/Time support for axes
* Subtitle
* Locale
* Dataset visibility (when you show/hide a category from the legend)
* Radar charts
* Custom formatting for axis tick values