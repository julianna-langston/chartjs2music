import type {Meta, StoryObj} from "@storybook/html-vite";
import matrix from "./charts/matrix";
import matrixMissingValues from "./charts/matrix_missing_values";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Matrix",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayAndTime: Story = {args: {sample: matrix}};
export const MissingValues: Story = {args: {sample: matrixMissingValues}};
