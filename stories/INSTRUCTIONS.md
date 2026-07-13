# Creating Storybook stories

Every new plugin feature needs at least one Storybook story and matching test coverage in `tests/`.

## Sample-based stories

Add a `*.stories.ts` file in this directory. When the feature has a reusable Chart.js sample under `samples/charts`, import that sample and render it with `renderSample`:

```ts
import type {Meta, StoryObj} from "@storybook/html-vite";
import myFeature from "../samples/charts/my_feature";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/My feature",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {sample: myFeature}};
```

Group related examples under the same Storybook title and give each story a descriptive export name.

## Stories with controls

For an example that needs Storybook Controls, derive a Chart.js configuration from the story args and pass it to `renderChart`:

```ts
import {renderChart} from "./sample-chart";

const meta = {
    title: "Chart2Music/My feature",
    render: (args) => renderChart({
        type: "bar",
        data: args.data,
        options: {
            plugins: {
                chartjs2music: {
                    options: {enableSound: args.enableSound}
                }
            }
        }
    })
};
```

`renderChart` creates the canvas and visible Chart2Music caption, registers the supported chart plugins, and merges the caption into `options.plugins.chartjs2music`. Do not add custom elements, `innerHTML`, or per-story caption wrappers.

When a new chart integration requires a Chart.js extension, register its controller and element in `sample-chart.ts` so every relevant story can render it.

## Verify

Run these checks before opening a pull request:

```bash
yarn test
yarn build-storybook
```
