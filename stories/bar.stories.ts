import type {Meta, StoryObj} from "@storybook/html-vite";
import floatingBar from "./charts/floating_bar";
import errorBars from "./charts/error_bars";
import gettingStarted from "./charts/getting_started_Example";
import groupedBar from "./charts/grouped_bar";
import simpleBar from "./charts/simple_bar";
import spanishBar from "./charts/spanish_bar";
import stackedBar from "./charts/stacked_bar";
import stringMinimum from "./charts/string_x_minimum";
import stringValues from "./charts/string_x_values";
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
export const ErrorBars: Story = {args: {sample: errorBars}};
export const Spanish: Story = {args: {sample: spanishBar}};
export const StringValues: Story = {args: {sample: stringValues}};
export const ClippedMinimum: Story = {args: {sample: stringMinimum}};
