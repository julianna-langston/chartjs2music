import type {Meta, StoryObj} from "@storybook/html-vite";
import matrix from "../samples/charts/matrix";
import matrixBasic from "../samples/charts/matrix_basic";
import matrixC2m from "../samples/charts/matrix_c2m";
import matrixCalendar from "../samples/charts/matrix_calendar";
import matrixCategory from "../samples/charts/matrix_category";
import matrixTime from "../samples/charts/matrix_time";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Matrix",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayAndTime: Story = {args: {sample: matrix}};
export const Basic: Story = {args: {sample: matrixBasic}};
export const Categories: Story = {args: {sample: matrixCategory}};
export const TimeScale: Story = {args: {sample: matrixTime}};
export const Calendar: Story = {args: {sample: matrixCalendar}};
export const Chart2MusicExample: Story = {args: {sample: matrixC2m}};
