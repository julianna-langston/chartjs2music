import type {Meta, StoryObj} from "@storybook/html-vite";
import floatingBar from "../samples/charts/floating_bar";
import gettingStarted from "../samples/charts/getting_started_Example";
import groupedBar from "../samples/charts/grouped_bar";
import logarithmic from "../samples/charts/log";
import simpleBar from "../samples/charts/simple_bar";
import spanishBar from "../samples/charts/spanish_bar";
import stackedBar from "../samples/charts/stacked_bar";
import stringMinimum from "../samples/charts/string_x_minimum";
import stringValues from "../samples/charts/string_x_values";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Bar",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {args: {sample: simpleBar}};
export const GettingStarted: Story = {args: {sample: gettingStarted}};
export const Grouped: Story = {args: {sample: groupedBar}};
export const Stacked: Story = {args: {sample: stackedBar}};
export const Floating: Story = {args: {sample: floatingBar}};
export const Spanish: Story = {args: {sample: spanishBar}};
export const StringValues: Story = {args: {sample: stringValues}};
export const StringMinimum: Story = {args: {sample: stringMinimum}};
export const Logarithmic: Story = {args: {sample: logarithmic}};
