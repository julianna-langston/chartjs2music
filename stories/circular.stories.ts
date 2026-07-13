import type {Meta, StoryObj} from "@storybook/html-vite";
import donut from "../samples/charts/donut";
import polarAreaOne from "../samples/charts/polarArea1";
import polarAreaTwo from "../samples/charts/polarArea2";
import radar from "../samples/charts/radar";
import stackedPie from "../samples/charts/stacked_pie";
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
export const Radar: Story = {args: {sample: radar}};
