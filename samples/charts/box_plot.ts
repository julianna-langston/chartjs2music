export default {
    type: "boxplot",
    data: {
        labels: ["SUV", "Sedan", "Sports", "Wagon", "Truck", "Hybrid"],
        datasets: [{
            backgroundColor: "lightsteelblue",
            data: [
                {
                    min: 10,
                    q1: 14,
                    median: 15,
                    mean: 15,
                    q3: 18,
                    max: 23
                },
                {
                    min: 14,
                    q1: 18,
                    median: 20,
                    mean: 21,
                    q3: 23,
                    max: 35,
                    outliers: [37, 37, 38, 40]
                },
                {
                    min: 12,
                    q1: 18,
                    median: 19,
                    mean: 19.5,
                    q3: 20,
                    max: 23,
                    outliers: [11, 26]
                },
                {
                    min: 15,
                    q1: 19,
                    median: 21,
                    mean: 22,
                    q3: 23,
                    max: 31
                },
                {
                    min: 13,
                    q1: 14,
                    median: 16,
                    mean: 16.5,
                    q3: 17,
                    max: 21,
                    outliers: [26, 26]
                },
                {
                    min: 45,
                    q1: 45,
                    mean: 55,
                    median: 59,
                    q3: 60,
                    max: 60
                }
            ]
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "City Mileage for Vehicle Types"
            }
        }
    }
};