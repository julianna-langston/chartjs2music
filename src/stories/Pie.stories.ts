import type { StoryObj, Meta } from '@storybook/html';
import { userEvent, waitFor, within, expect } from '@storybook/test';
import type { ChartProps } from './Chart';
import { createChart } from './Chart';
import { Chart, ChartTypeRegistry } from 'chart.js';

const meta = {
  title: 'Charts/Pies and Donuts',
  render: (args) => createChart(args)
} satisfies Meta<ChartProps>;

export default meta;
type Story = StoryObj<ChartProps>;

export const Donut: Story = {
  args: {
    type: "doughnut",
    data: {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    }
  }
}

export const StackedPie: Story = {
  args: {
    type: "pie",
    data: {
      labels: ['Overall Yay', 'Overall Nay', 'Group A Yay', 'Group A Nay', 'Group B Yay', 'Group B Nay', 'Group C Yay', 'Group C Nay'],
      datasets: [
        {
          backgroundColor: ['#AAA', '#777'],
          data: [21, 79]
        },
        {
          backgroundColor: ['hsl(0, 100%, 60%)', 'hsl(0, 100%, 35%)'],
          data: [33, 67]
        },
        {
          backgroundColor: ['hsl(100, 100%, 60%)', 'hsl(100, 100%, 35%)'],
          data: [20, 80]
        },
        {
          backgroundColor: ['hsl(180, 100%, 60%)', 'hsl(180, 100%, 35%)'],
          data: [10, 90]
        }
      ]
    }
  }
}
