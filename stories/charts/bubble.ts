export default {
    type: 'bubble',
    data: {
        datasets: [{
          label: 'Scatter Dataset',
          data: [{
            x: -10,
            y: 0,
            r: 5
          }, {
            x: 0,
            y: 10,
            r: 8
          }, {
            x: 10,
            y: 5,
            r: 4
          }, {
            x: 0.5,
            y: 5.5,
            r: 10
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        }],
      },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  }