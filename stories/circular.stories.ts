import type {Meta, StoryObj} from "@storybook/html-vite";
import donut from "./charts/donut";
import polarAreaOne from "./charts/polarArea1";
import polarAreaTwo from "./charts/polarArea2";
import stackedPie from "./charts/stacked_pie";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Circular",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Donut: Story = {args: {sample: donut}};
export const StackedPie: Story = {args: {sample: stackedPie}};
export const PolarArea: Story = {args: {sample: polarAreaOne}};
export const DensePolarArea: Story = {args: {sample: polarAreaTwo}};
