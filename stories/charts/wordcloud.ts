export default {
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