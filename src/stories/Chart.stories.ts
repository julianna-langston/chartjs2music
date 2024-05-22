import type { StoryObj, Meta } from '@storybook/html';
import { userEvent, waitFor, within, expect } from '@storybook/test';
import type { ChartProps } from './Chart';
import { createChart } from './Chart';
import { Chart, ChartTypeRegistry } from 'chart.js';

const meta = {
  title: 'Charts',
  render: (args) => createChart(args)
} satisfies Meta<ChartProps>;

export default meta;
type Story = StoryObj<ChartProps>;

export const ChartjsGettingStartedExample: Story = {
  args: {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          title: {
            text: "Color",
            display: true
          }  
        }
      }
    }
  }
}

export const GroupedLineChart: Story = {
  args: {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: 'Fully Rounded',
          data: [60, 75, 2, -60, -62, 25, 100],
          backgroundColor: "red",
          borderWidth: 2,
          borderRadius: Number.MAX_VALUE,
          borderSkipped: false,
        },
        {
            label: "Normal",
          data: [55,80, 5, -40, -55, -55, 90],
          backgroundColor: "blue",
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
        }
      ]
    },
    
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  }
  }
}

// https://codepen.io/nwi4/details/PoBmxKo
const zeroes = new Array(100).fill(0);
export const PolarArea: Story = {
  args: {
    type: 'polarArea' as keyof ChartTypeRegistry,
    data: {
        labels: zeroes.map((k, i) => 'Label ' + i),
        datasets: [{
            label: '# of Votes',
            data: zeroes.map((k, i) => Math.random())
        }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          pointLabels: {
                display: true,
                centerPointLabels: true,
                font: {
                  size: 13
                }
              }
        }
      }
    }
  }
}

export const Radar: Story = {
  args: {
    type: 'radar',
    data: {
      labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      }
    },
  }
}

export const WordCloud: Story = {
  args: {
      type: 'wordCloud',
      data: {
        // text
        labels: ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this'],
        datasets: [
          {
            // size in pixel
            data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
          },
        ],
      },
      options: {
          plugins: {
              legend: {
                  display: false
              },
              title: {
                  display: false,
                  text: "Word Cloud Examples"
              }
          }
      }
  }
};

const words = [
  { key: 'word', value: 10 },
  { key: 'words', value: 8 },
  { key: 'sprite', value: 7 },
  { key: 'placed', value: 5 },
  { key: 'layout', value: 4 },
  { key: 'algorithm', value: 4 },
  { key: 'area', value: 4 },
  { key: 'without', value: 3 },
  { key: 'step', value: 3 },
  { key: 'bounding', value: 3 },
  { key: 'retrieve', value: 3 },
  { key: 'operation', value: 3 },
  { key: 'collision', value: 3 },
  { key: 'candidate', value: 3 },
  { key: '32', value: 2 },
  { key: 'placement', value: 2 },
  { key: 'time', value: 2 },
  { key: 'possible', value: 2 },
  { key: 'even', value: 2 },
  { key: 'simple', value: 2 },
  { key: 'starting', value: 2 },
  { key: 'previously', value: 2 },
  { key: 'move', value: 2 },
  { key: 'perform', value: 2 },
  { key: 'hierarchical', value: 2 },
  { key: 'draw', value: 2 },
  { key: 'pixel', value: 2 },
  { key: 'data', value: 2 },
  { key: 'separately', value: 2 },
  { key: 'expensive', value: 2 },
  { key: 'pixels', value: 2 },
  { key: 'masks', value: 2 },
  { key: 'implementation', value: 2 },
  { key: 'detection', value: 2 },
  { key: 'larger', value: 2 },
  { key: 'whole', value: 2 },
  { key: 'comparing', value: 2 },
  { key: 'box', value: 2 },
  { key: 'large', value: 2 },
  { key: 'think', value: 2 },
  { key: 'version', value: 2 },
  { key: 'single', value: 2 },
  { key: 'tree', value: 2 },
  { key: 'Cloud', value: 1 },
  { key: 'Generator', value: 1 },
  { key: 'Works', value: 1 },
  { key: 'positioning', value: 1 },
  { key: 'overlap', value: 1 },
  { key: 'available', value: 1 },
  { key: 'GitHub', value: 1 },
  { key: 'open', value: 1 },
  { key: 'source', value: 1 },
  { key: 'license', value: 1 },
  { key: 'd3cloud', value: 1 },
  { key: 'Note', value: 1 },
  { key: 'code', value: 1 },
  { key: 'converting', value: 1 },
  { key: 'text', value: 1 },
  { key: 'rendering', value: 1 },
  { key: 'final', value: 1 },
  { key: 'output', value: 1 },
  { key: 'requires', value: 1 },
  { key: 'additional', value: 1 },
  { key: 'development', value: 1 },
  { key: 'quite', value: 1 },
  { key: 'slow', value: 1 },
  { key: 'hundred', value: 1 },
  { key: 'run', value: 1 },
  { key: 'asynchronously', value: 1 },
  { key: 'configurable', value: 1 },
  { key: 'size', value: 1 },
  { key: 'makes', value: 1 },
  { key: 'animate', value: 1 },
  { key: 'stuttering', value: 1 },
  { key: 'recommended', value: 1 },
  { key: 'always', value: 1 },
  { key: 'use', value: 1 },
  { key: 'animations', value: 1 },
  { key: 'prevents', value: 1 },
  { key: 'browsers', value: 1 },
  { key: 'event', value: 1 },
  { key: 'loop', value: 1 },
  { key: 'blocking', value: 1 },
  { key: 'placing', value: 1 },
  { key: 'incredibly', value: 1 },
  { key: 'important', value: 1 },
  { key: 'Attempt', value: 1 },
  { key: 'place', value: 1 },
  { key: 'point', value: 1 },
  { key: 'usually', value: 1 },
  { key: 'near', value: 1 },
  { key: 'middle', value: 1 },
  { key: 'somewhere', value: 1 },
  { key: 'central', value: 1 },
  { key: 'horizontal', value: 1 },
  { key: 'line', value: 1 },
  { key: 'intersects', value: 1 },
  { key: 'one', value: 1 },
  { key: 'along', value: 1 },
  { key: 'increasing', value: 1 },
  { key: 'spiral', value: 1 },
  { key: 'Repeat', value: 1 },
  { key: 'intersections', value: 1 },
  { key: 'found', value: 1 },
  { key: 'hard', value: 1 },
  { key: 'part', value: 1 },
  { key: 'making', value: 1 },
  { key: 'efficiently', value: 1 },
  { key: 'According', value: 1 },
  { key: 'Jonathan', value: 1 },
  { key: 'Feinberg', value: 1 },
  { key: 'Wordle', value: 1 },
  { key: 'uses', value: 1 },
  { key: 'combination', value: 1 },
  { key: 'boxes', value: 1 },
  { key: 'quadtrees', value: 1 },
  { key: 'achieve', value: 1 },
  { key: 'reasonable', value: 1 },
  { key: 'speeds', value: 1 },
  { key: 'Glyphs', value: 1 },
  { key: 'JavaScript', value: 1 },
  { key: 'isnt', value: 1 },
  { key: 'way', value: 1 },
  { key: 'precise', value: 1 },
  { key: 'glyph', value: 1 },
  { key: 'shapes', value: 1 },
  { key: 'via', value: 1 },
  { key: 'DOM', value: 1 },
  { key: 'except', value: 1 },
  { key: 'perhaps', value: 1 },
  { key: 'SVG', value: 1 },
  { key: 'fonts', value: 1 },
  { key: 'Instead', value: 1 },
  { key: 'hidden', value: 1 },
  { key: 'canvas', value: 1 },
  { key: 'element', value: 1 },
  { key: 'Retrieving', value: 1 },
  { key: 'many', value: 1 },
  { key: 'batch', value: 1 },
  { key: 'Sprites', value: 1 },
  { key: 'initial', value: 1 },
  { key: 'performed', value: 1 },
  { key: 'using', value: 1 },
  { key: 'doesnt', value: 1 },
  { key: 'copy', value: 1 },
  { key: 'appropriate', value: 1 },
  { key: 'position', value: 1 },
  { key: 'representing', value: 1 },
  { key: 'advantage', value: 1 },
  { key: 'involves', value: 1 },
  { key: 'relevant', value: 1 },
  { key: 'rather', value: 1 },
  { key: 'previous', value: 1 },
  { key: 'Somewhat', value: 1 },
  { key: 'surprisingly', value: 1 },
  { key: 'lowlevel', value: 1 },
  { key: 'hack', value: 1 },
  { key: 'made', value: 1 },
  { key: 'tremendous', value: 1 },
  { key: 'difference', value: 1 },
  { key: 'constructing', value: 1 },
  { key: 'compressed', value: 1 },
  { key: 'blocks', value: 1 },
  { key: '1bit', value: 1 },
  { key: '32bit', value: 1 },
  { key: 'integers', value: 1 },
  { key: 'thus', value: 1 },
  { key: 'reducing', value: 1 },
  { key: 'number', value: 1 },
  { key: 'checks', value: 1 },
  { key: 'memory', value: 1 },
  { key: 'times', value: 1 },
  { key: 'fact', value: 1 },
  { key: 'turned', value: 1 },
  { key: 'beat', value: 1 },
  { key: 'quadtree', value: 1 },
  { key: 'everything', value: 1 },
  { key: 'tried', value: 1 },
  { key: 'areas', value: 1 },
  { key: 'font', value: 1 },
  { key: 'sizes', value: 1 },
  { key: 'primarily', value: 1 },
  { key: 'needs', value: 1 },
  { key: 'test', value: 1 },
  { key: 'per', value: 1 },
  { key: 'whereas', value: 1 },
  { key: 'compare', value: 1 },
  { key: 'every', value: 1 },
  { key: 'overlaps', value: 1 },
  { key: 'slightly', value: 1 },
  { key: 'Another', value: 1 },
  { key: 'possibility', value: 1 },
  { key: 'merge', value: 1 },
  { key: 'fairly', value: 1 },
  { key: 'though', value: 1 },
  { key: 'compared', value: 1 },
  { key: 'analagous', value: 1 },
  { key: 'mask', value: 1 },
  { key: 'essentially', value: 1 },
  { key: 'ORing', value: 1 },
  { key: 'block', value: 1 },
];

export const WordcloudFromTheInternet: Story = {
  args: {
    type: "wordCloud",
    data: {
      labels: words.map((d) => d.key),
      datasets: [
        {
          label: '',
          data: words.map((d) => 10 + d.value * 10),
        },
      ],
    },
    options: {
      plugins: {
          title: {
              display: false,
              text: "Sample word cloud"
          },
            legend: {
                display: false
            }
        }
    }
  }
}