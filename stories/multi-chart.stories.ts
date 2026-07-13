import type {Meta, StoryObj} from "@storybook/html-vite";
import barLine from "../samples/charts/bar_line";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Multi-chart",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarAndLine: Story = {args: {sample: barLine}};
