import type {Meta, StoryObj} from "@storybook/html-vite";
import groupedLine from "./charts/grouped_line";
import logarithmic from "./charts/log";
import memoryChart from "./charts/memoryChart";
import multiAxis from "./charts/multi_axis";
import parsing from "./charts/parsing";
import stringMinimum from "./charts/string_x_minimum";
import titleSubtitle from "./charts/title_subtitle";
import zoom from "./charts/zoom";
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
export const TitleAndSubtitle: Story = {args: {sample: titleSubtitle}};
export const Logarithmic: Story = {args: {sample: logarithmic}};
export const ClippedMinimum: Story = {args: {sample: stringMinimum}};
export const Parsing: Story = {args: {sample: parsing}};
export const ZoomAndPan: Story = {args: {sample: zoom}};
