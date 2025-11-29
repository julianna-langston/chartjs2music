import type { ChartOptions, Plugin, Chart } from "chart.js";
import c2mChart, {c2m} from "chart2music";
import {processBoxData} from "./boxplots";

type ChartStatesTypes = {
    c2m: c2m;
    lastDataSnapshot: string;
}

export const chartStates = new Map<Chart, ChartStatesTypes>();

const chartjs_c2m_converter: any = {
    bar: "bar",
    line: "line",
    pie: "pie",
    polarArea: "bar",
    doughnut: "pie",
    boxplot: "box",
    radar: "bar",
    wordCloud: "bar",
    scatter: "scatter"
};

const processChartType = (chart: any) => {
    const topLevelType = chart.config.type;

    const panelTypes = chart.data.datasets.map(({type}: any) => type ?? topLevelType);

    const invalid = panelTypes.find((t: string) => !(t in chartjs_c2m_converter));
    if(invalid){
        return {
            valid: false,
            invalidType: invalid
        }
    }

    if([...new Set(panelTypes)].length === 1){
        return {
            valid: true,
            c2m_types: chartjs_c2m_converter[panelTypes[0] as keyof typeof chartjs_c2m_converter]
        };
    }

    return {
        valid: true,
        c2m_types: panelTypes.map((t: string) => chartjs_c2m_converter[t])
    }
}

const generateAxisInfo = (chartAxisInfo: any, chart: any) => {
    const axis = {} as any;
    if(chartAxisInfo?.min !== undefined){
        if(typeof chartAxisInfo.min === "string"){
            axis.minimum = chart.data.labels.indexOf(chartAxisInfo.min);
        }else{
            axis.minimum = chartAxisInfo.min;
        }
    }
    if(chartAxisInfo?.max !== undefined){
        if(typeof chartAxisInfo.max === "string"){
            axis.maximum = chart.data.labels.indexOf(chartAxisInfo.max);
        }else{
            axis.maximum = chartAxisInfo.max;
        }
    }
    const label = chartAxisInfo?.title?.text;
    if(label){
        axis.label = label;
    }

    if(chartAxisInfo?.type === "logarithmic"){
        axis.type = "log10";
    }

    return axis;
}

const generateAxes = (chart: any) => {
    const axes = {
        x: {
            ...generateAxisInfo(chart.options?.scales?.x, chart),
        },
        y: {
            format: (value: number) => value.toLocaleString(),
            ...generateAxisInfo(chart.options?.scales?.y, chart),
        }
    };

    const xAxisValueLabels = chart.data.labels.slice(0);
    if(xAxisValueLabels.length > 0){
        axes.x.valueLabels = xAxisValueLabels;
    }

    return axes;
}

const whichDataStructure = (data: any[]) => {
    if(Array.isArray(data[0])){
        return data.map((arr: any, x: number) => {
            let [low, high] = arr.sort()
            return {x, low, high};
        });
    }
    return data;
}

const scrubX = (data: any) => {
    const blackboard = JSON.parse(JSON.stringify(data));

    let labels: string[] = [];
    if(Array.isArray(data)){
        // console.log("not grouped");
        // Not grouped
        blackboard.forEach((item, x) => {
            if(typeof item === "object" && item !== null && "x" in item){
                labels.push(item.x);
                item.x = x;
            }
        });
        return {labels, data: blackboard};

    }else{
        // Grouped

    }
}

const processData = (data: any, c2m_types: string) => {
    if(c2m_types === "box"){
        return processBoxData(data);
    }
    let groups: string[] = [];

    if(data.datasets.length === 1){
        return {
            data: whichDataStructure(data.datasets[0].data)
        }
    }

    const result = {} as Record<string, any>;

    data.datasets.forEach((obj: any, index: number) => {
        const groupName = obj.label ?? `Group ${index+1}`;
        groups.push(groupName);

        result[groupName] = whichDataStructure(obj.data);
    });

    return {groups, data: result};
}

const determineChartTitle = (options: ChartOptions) => {
    if(options.plugins?.title?.text){
        if(Array.isArray(options.plugins.title.text)){
            return options.plugins.title.text.join(", ");
        }
        return options.plugins.title.text;
    }
    return "";
}

const determineCCElement = (canvas: HTMLCanvasElement, provided: HTMLElement | null) => {
    if(provided){
        return provided;
    }

    const cc = document.createElement("div");
    canvas.insertAdjacentElement("afterend", cc);
    return cc;
}

const createDataSnapshot = (chart: Chart) => {
    return JSON.stringify({
        datasets: chart.data.datasets.map(ds => ds.data),
        labels: chart.data.labels
    });
}

const displayPoint = (chart: Chart) => {
    if(!chartStates.has(chart)){
        return;
    }
    const {c2m: ref} = chartStates.get(chart) as ChartStatesTypes;
    const {point, index} = ref.getCurrent();

    // Use Chart2Music's internal visible group tracking
    // @ts-ignore - accessing internal Chart2Music property
    const visibleGroupIndices = ref._visible_group_indices?.slice(1) || [];

    try{
        const highlightElements = [];
        if("custom" in point){
            highlightElements.push({
                // @ts-ignore
                datasetIndex: point.custom.group,
                // @ts-ignore
                index: point.custom.index
            });
        }else{
            // For stacked charts, Chart2Music includes an "All" group at index 0,
            // so we subtract 1 to get the actual dataset index
            visibleGroupIndices.forEach((groupIndex: number) => {
                highlightElements.push({
                    datasetIndex: groupIndex - 1,
                    index
                })
            })
        }
        chart?.setActiveElements(highlightElements);
        chart?.tooltip?.setActiveElements(highlightElements, {})
        chart?.update();
    }catch(e){
        // console.warn(e);
    }
}

const generateChart = (chart: Chart, options: ChartOptions) => {
    const {valid, c2m_types, invalidType} = processChartType(chart);

    if(!valid){
        // @ts-ignore
        options.errorCallback?.(`Unable to connect chart2music to chart. The chart is of type "${invalidType}", which is not one of the supported chart types for this plugin. This plugin supports: ${Object.keys(chartjs_c2m_converter).join(", ")}`);
        return;
    }

    let axes = generateAxes(chart);

    if(chart.config.type === "wordCloud"){
        delete axes.x.minimum;
        delete axes.x.maximum;
        delete axes.y.minimum;
        delete axes.y.maximum;

        if(!axes.x.label){
            axes.x.label = "Word";
        }
        if(!axes.y.label){
            axes.y.label = "Emphasis";
        }
    }

    // Generate CC element
    const cc = determineCCElement(chart.canvas, options.cc);

    const {data, groups} = processData(chart.data, c2m_types);
    // lastDataObj = JSON.stringify(data);

    let scrub = scrubX(data);
    if(scrub?.labels && scrub?.labels?.length > 0){   // Something was scrubbed
        if(!chart.data.labels || chart.data.labels.length === 0){
            axes.x.valueLabels = scrub.labels.slice(0);
        }
    }

    if(c2m_types === "scatter"){
        delete scrub?.data;
        delete axes.x.valueLabels;
    }

    axes = {
        ...axes,
        x: {
            ...axes.x,
            ...(options.axes?.x)
        },
        y: {
            ...axes.y,
            ...(options.axes?.y)
        },
    };

    const c2mOptions = {
        cc,
        element: chart.canvas,
        type: c2m_types,
        data: scrub?.data ?? data,
        title: determineChartTitle(chart.options),
        axes,
        options: {
            // @ts-ignore
            onFocusCallback: () => {
                displayPoint(chart);
            }
        }
    };

    if(Array.isArray(c2mOptions.data)){
        if(isNaN(c2mOptions.data[0])){
            c2mOptions.data = c2mOptions.data.map((point, index) => {
                return {
                    ...point,
                    custom: {
                        group: 0,
                        index
                    }
                }
            })
        }else{
            c2mOptions.data = c2mOptions.data.map((num, index) => {
                return {
                    x: index,
                    y: num,
                    custom: {
                        group: 0,
                        index
                    }
                }
            })
        }
    }else{
        const groups = Object.keys(c2mOptions.data);
        groups.forEach((groupName, groupNumber) => {
            if(!isNaN(c2mOptions.data[groupName][0])){
                c2mOptions.data[groupName] = c2mOptions.data[groupName].map((num: number, index: number) => {
                    return {
                        x: index,
                        y: num,
                        custom: {
                            group: groupNumber,
                            index
                        }
                    }
                })
            }else{
                c2mOptions.data[groupName] = c2mOptions.data[groupName].map((point: any, index: number) => {
                    return {
                        ...point,
                        custom: {
                            group: groupNumber,
                            index
                        }
                    }
                })
            }
        });
    }

    // @ts-ignore
    if(chart.config.options?.scales?.x?.stacked){
        // @ts-ignore
        c2mOptions.options.stack = true;
    }

        // @ts-ignore
    if(options.audioEngine){
        // @ts-ignore
        c2mOptions.audioEngine = options.audioEngine;
    }

    if(c2mOptions.data.length === 0){
        return;
    }

    if(options.lang){
        c2mOptions.lang = options.lang;
    }

    const {err, data:c2m} = c2mChart(c2mOptions);

    /* istanbul-ignore-next */
    if(err){
        // @ts-ignore
        options.errorCallback?.(err);
        return;
    }

    if(!c2m){
        return;
    }

    chartStates.set(chart, {
        c2m,
        lastDataSnapshot: createDataSnapshot(chart)
    });

}

const plugin: Plugin = {
    id: "chartjs2music",

    afterInit: (chart: Chart, args, options) => {
        if(!chartStates.has(chart)){
            generateChart(chart, options);

            // Remove tooltip when the chart blurs
            chart.canvas.addEventListener("blur", () => {
                chart.setActiveElements([]);
                chart.tooltip?.setActiveElements([], {});
                try {
                    chart.update();
                } catch(e){
                    // console.warn(e);
                }
            });

            // Show tooltip when the chart receives focus
            chart.canvas.addEventListener("focus", () => {
                displayPoint(chart);
            });
        }
    },

    afterDatasetUpdate: (chart: Chart, args, options) => {
        if(!args.mode){
            return;
        }

        if(!chartStates.has(chart)){
            generateChart(chart, options);
        }

        const {c2m: ref} = chartStates.get(chart) as ChartStatesTypes;
        if(!ref){
            return;
        }

        // @ts-ignore
        const groups = ref._groups.slice(0);
        // @ts-ignore
        if(ref._options.stack){
            groups.shift();
        }

        if(args.mode === "hide"){
            const err = ref.setCategoryVisibility(groups[args.index], false);
            if(err){console.error(err)}
            return;
        }

        if(args.mode === "show"){
            const err = ref.setCategoryVisibility(groups[args.index], true);
            if(err){console.error(err)}
            return;
        }
    },

    afterDatasetsUpdate: (chart: Chart, args, options) => {
        const state = chartStates.get(chart);
        if(!state?.c2m) return;

        // Check if data has changed
        const currentSnapshot = createDataSnapshot(chart);
        if(currentSnapshot === state.lastDataSnapshot) {
            return; // No data change, skip update
        }

        // Get chart type
        const {valid, c2m_types} = processChartType(chart);
        if(!valid) return;

        // Process data and generate axes
        const {data} = processData(chart.data, c2m_types);
        const axes = generateAxes(chart);

        // Update Chart2Music with new data
        state.c2m.setData(data, axes);

        // Update snapshot
        state.lastDataSnapshot = currentSnapshot;
    },

    afterDestroy: (chart) => {
        const {c2m: ref} = chartStates.get(chart) as ChartStatesTypes;
        if(!ref){
            return;
        }

        ref.cleanUp();
    },

    defaults: {
        cc: null,
        audioEngine: null,
        errorCallback: null
    }

};

export default plugin;