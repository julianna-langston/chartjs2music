import type { StoryObj, Meta } from '@storybook/html';
import { userEvent, waitFor, within, expect } from '@storybook/test';
import type { ChartProps } from './Chart';
import { createChart } from './Chart';
import { Chart, ChartTypeRegistry } from 'chart.js';

const meta = {
  title: 'Charts/Edge Cases',
  render: (args) => createChart(args)
} satisfies Meta<ChartProps>;

export default meta;
type Story = StoryObj<ChartProps>;

export const Empty: Story = {
  args: {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    },
    updateData: (chart: Chart) => {
      chart.data.labels = "ABCDE".split("");
      chart.data.datasets[0].data = [1,2,3,4,5];
      chart.update();
      console.log(chart);
      return false;
  }
  }
}

export const FloatingBar: Story = {
  args: {
    type: 'bar',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: 'Dataset 1',
          data: [
              [90, -30],
              [-30, 20],
              [70, -50],
          ],
          backgroundColor: "red"
        },
        {
          label: 'Dataset 2',
          data: [
              [90, -30],
              [-30, 20],
              [70, -50],
          ],
          backgroundColor: "blue",
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Floating Bar Chart'
        }
      }
    }
  }
}
export const Log: Story = {
  args: {
    type: 'line',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: 'Dataset 1',
          data: [50, 1000, 50000, 20000, 150, 90000, 10],
          borderColor: "red",
          backgroundColor: "red",
          fill: false,
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: ['Chart.js Line Chart', "Logarithmic"]
        },
        chartjs2music: {
          axes: {
            y: {
              format: (value: number) => `$${value.toLocaleString()}`
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
        },
        y: {
          display: true,
          type: 'logarithmic',
          ticks: {
            callback: (value) => `$${value.toLocaleString()}`
          }
        }
      }
    },
  }
}
export const Spanish: Story = {
  args: {
    type: "bar" as keyof ChartTypeRegistry,
    data: {
        labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
        datasets: [{
            data: [10, 20, 15, 25, 22, 30, 18]
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Prueba"
            },
            legend: {
                display: false
            },
            chartjs2music: {
                lang: "es"
            }
        },
        scales: {
            x: {
                title: {
                    text: "Año"
                }
            },
            y: {
                title: {
                    text: "Cuantos",
                    display: false
                }
            }
        }
    },
  },
  async play({ canvasElement, step }) {
    const canvas = within(canvasElement);
    const cc = canvas.getByRole("status");

    await step("User tabs to chart", async () => {
      await userEvent.tab();
      
      await waitFor(() => expect(cc).toHaveTextContent(`Gráfico Sonificado llamado "Prueba"`));
      expect(cc).toHaveTextContent(`Gráfico de barras.`);
      expect(cc).toHaveTextContent(`X es "Año" de 2010 a 2016`);
      expect(cc).toHaveTextContent(`Y es "Cuantos" de 10 a 30`);
    });
  },
};

export const StringXMinimum: Story = {
  args: {
    type: 'line',
    data: {
        datasets: [{
            data: [10, 20, 30, 40, 50, 60]
        }],
        labels: ['January', 'February', 'March', 'April', 'May', 'June']
    },
    options: {
        scales: {
            x: {
                min: 'March'
            }
        }
    }
  }
};

export const StringXValues: Story = {
  args: {
    type: 'bar',
    data: {
      datasets: [{
        // @ts-expect-error
        data: [{x: 'Sales', y: 20}, {x: 'Revenue', y: 10}]
      }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        }
    }

  }
}
