import { ChartTypeRegistry } from "chart.js";

export default {
    type: "boxplot" as keyof ChartTypeRegistry,
    data: {
        labels: ["Sepal Length", "Sepal width", "Petal length", "Petal width"],
        datasets: [
            {
                label: "Setosa",
                backgroundColor: "orange",
                data: [
                    {
                        min: 4.3,
                        q1: 4.8,
                        median: 5,
                        q3: 5.2,
                        max: 5.8,
                        mean: 5.006
                    },
                    {
                        min: 2.3,
                        q1: 3.2,
                        median: 3.4,
                        mean: 3.428,
                        q3: 3.675,
                        max: 4.4,
                        outliers: [2.3, 4.4]
                    },
                    {
                        min: 1,
                        q1: 1.4,
                        median: 1.5,
                        mean: 1.462,
                        q3: 1.575,
                        max: 1.9,
                        outliers: [1,1.1,1.9]
                    },
                    {
                        min: 0.1,
                        q1: 0.2,
                        median: 0.2,
                        mean: 0.248,
                        q3: 0.3,
                        max: 0.6,
                        outliers: [0.5, 0.6]
                    }
                ]
            },
            {
                label: "Versicolor",
                backgroundColor: "blue",
                data: [
                    {
                        min: 4.9,
                        q1: 5.6,
                        median: 5.9,
                        mean: 5.936,
                        q3: 6.3,
                        max: 7
                    },
                    {
                        min: 2,
                        q1: 2.525,
                        median: 2.8,
                        mean: 2.77,
                        q3: 3,
                        max: 3.4
                    },
                    {
                        min: 3,
                        q1: 4,
                        median: 4.35,
                        mean: 4.26,
                        q3: 4.6,
                        max: 5.1,
                        outliers: [3]
                    },
                    {
                        min: 1,
                        q1: 1.2,
                        median: 1.3,
                        mean: 1.326,
                        q3: 1.5,
                        max: 1.8
                    }
                ]
            },
            {
                label: "Virginica",
                backgroundColor: "purple",
                data: [
                    {
                        min: 4.9,
                        q1: 6.225,
                        median: 6.5,
                        mean: 6.588,
                        q3: 6.9,
                        max: 7.9,
                        outliers: [4.9]
                    },
                    {
                        min: 2.2,
                        q1: 2.8,
                        median: 3,
                        mean: 2.974,
                        q3: 3.175,
                        max: 3.8,
                        outliers: [2.2, 3.8]
                    },
                    {
                        min: 4.5,
                        q1: 5.1,
                        median: 5.55,
                        mean: 5.552,
                        q3: 5.875,
                        max: 6.9
                    },
                    {
                        min: 1.4,
                        q1: 1.8,
                        median: 2,
                        mean: 2.026,
                        q3: 2.3,
                        max: 2.5
                    }
                ]
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Iris"
            }
        }
    }
};