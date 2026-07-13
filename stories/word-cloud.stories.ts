import type {Meta, StoryObj} from "@storybook/html-vite";
import wordCloud from "../samples/charts/wordcloud";
import wordCloudTwo from "../samples/charts/wordcloud2";
import {renderSample, type SampleStoryArgs} from "./sample-chart";

const meta = {
    title: "Chart2Music/Word cloud",
    render: renderSample
} satisfies Meta<SampleStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {args: {sample: wordCloud}};
export const WithRotation: Story = {args: {sample: wordCloudTwo}};
