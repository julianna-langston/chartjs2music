import type {Meta, StoryObj} from "@storybook/html-vite";
import groupedLine from "./charts/grouped_line";
import memoryChart from "./charts/memoryChart";
import multiAxis from "./charts/multi_axis";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Line",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grouped: Story = {args: {sample: groupedLine}};
export const MemoryUsage: Story = {args: {sample: memoryChart}};
export const MultiAxis: Story = {args: {sample: multiAxis}};
