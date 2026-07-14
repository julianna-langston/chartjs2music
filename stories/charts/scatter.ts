export default {
    type: 'scatter',
    data: {
        datasets: [{
          label: 'Scatter Dataset',
          data: [{
            x: -10,
            y: 0
          }, {
            x: 0,
            y: 10
          }, {
            x: 10,
            y: 5
          }, {
            x: 0.5,
            y: 5.5
          }, {
            x: -7,
            y: 7
          }, {
            x: 4,
            y: -3
          }, {
            x: 7,
            y: 12
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        }],
      },
    options: {
      plugins: {legend: {display: false}},
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  }
