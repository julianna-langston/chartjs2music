import type {Meta, StoryObj} from "@storybook/html-vite";
import groupedScatter from "./charts/grouped_scatter";
import scatter from "./charts/scatter";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Scatter",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {args: {sample: scatter}};
export const Grouped: Story = {args: {sample: groupedScatter}};
