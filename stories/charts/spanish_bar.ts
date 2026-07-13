import type {ChartTypeRegistry} from "chart.js";

// 2020 census populations for Mexico's 31 states (Mexico City excluded).
// Source: INEGI, Censo de Poblacion y Vivienda 2020.
const states = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Estado de Mexico", "Michoacan", "Morelos", "Nayarit", "Nuevo Leon", "Oaxaca", "Puebla", "Queretaro", "Quintana Roo", "San Luis Potosi", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatan", "Zacatecas"
];
const populations = [1425607, 3769020, 798447, 928363, 5543828, 3741869, 3146771, 731391, 1832650, 6166934, 3540685, 3082841, 8348151, 16992418, 4748846, 1971520, 1235456, 5784442, 4132148, 6583278, 2368467, 1857985, 2822255, 3026943, 2944840, 2402598, 3527735, 1342977, 8062579, 2320898, 1622138];

export default {
    type: "bar" as keyof ChartTypeRegistry,
    data: {labels: states, datasets: [{label: "Población", data: populations, backgroundColor: "#1d8f5f"}]},
    options: {
        plugins: {
            title: {display: true, text: "Población por estado de México (2020)"},
            legend: {display: false},
            chartjs2music: {lang: "es-MX"}
        },
        scales: {
            x: {title: {display: true, text: "Estados"}},
            y: {title: {display: true, text: "Población"}, ticks: {callback: (value) => Number(value).toLocaleString("es-MX")}}
        }
    }
};
