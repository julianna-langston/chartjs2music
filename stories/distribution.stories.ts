import type {Meta, StoryObj} from "@storybook/html-vite";
import boxPlot from "./charts/box_plot";
import boxPlotGroup from "./charts/box_plot_group";
import boxPlotGroupNumbers from "./charts/box_plot_group_numbers";
import boxPlotNumbers from "./charts/box_plot_numbers";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Distribution",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoxPlot: Story = {args: {sample: boxPlot}};
export const NumericBoxPlot: Story = {args: {sample: boxPlotNumbers}};
export const GroupedBoxPlot: Story = {args: {sample: boxPlotGroup}};
export const GroupedNumericBoxPlot: Story = {args: {sample: boxPlotGroupNumbers}};
