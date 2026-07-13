import type { ChartOptions, Plugin, Chart, Point, CartesianScaleOptions, ChartConfiguration, ChartTypeRegistry } from "chart.js";
import c2mChart, {c2m, C2MChartConfig} from "chart2music";
import {processBoxData} from "./boxplots";
import {convertErrorBarData, normalizeErrorBarBounds} from "./errorBars";

// Extended types for custom data
type CustomDataPoint = {
    group: number;
    index: number;
    datasetIndex?: number;
};

// Type for data manipulation
type DataSet = NonNullable<C2MChartConfig['data']>;

type ChartStatesTypes = {
    c2m: c2m;
    lastDataSnapshot: string;
    axesResolved?: boolean;
    cc: HTMLElement;
    title: string;
    matrixKeydown?: (event: KeyboardEvent) => void;
    matrixKeydownTarget?: HTMLCanvasElement;
}

const chartStates = new Map<Chart, ChartStatesTypes>();

const chartjs_c2m_converter: any = {
    bar: "bar",
    barWithErrorBars: "bar",
    line: "line",
    pie: "pie",
    polarArea: "bar",
    doughnut: "pie",
    boxplot: "box",
    radar: "bar",
    wordCloud: "bar",
    scatter: "scatter",
    matrix: "matrix"
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
    type axisType = NonNullable<C2MChartConfig["axes"]>;
    type axisKeys = "x" | "y" | "y2";
    const axis = {} as NonNullable<axisType[axisKeys]>;
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

type ResolvedAxes = NonNullable<C2MChartConfig["axes"]> & {
    x: NonNullable<NonNullable<C2MChartConfig["axes"]>["x"]>;
    y: NonNullable<NonNullable<C2MChartConfig["axes"]>["y"]>;
}

type AxisResolution = {
    axes: ResolvedAxes;
    secondaryAxisDatasetIndexes: Set<number>;
    requiresRefresh: boolean;
    error?: string;
}

const axisIds = (chart: any, axis: "x" | "y"): string[] => {
    const resolvedIds = [...new Set<string>(chart.data.datasets.flatMap((_dataset: unknown, index: number): string[] => {
        const scale = chart.getDatasetMeta(index)[`${axis}Scale`];
        return scale?.id ? [String(scale.id)] : [];
    }))];
    if(resolvedIds.length > 0){
        return resolvedIds;
    }

    const axisId = `${axis}AxisID`;
    return [...new Set<string>(chart.data.datasets.flatMap((dataset: any): string[] => {
        return dataset[axisId] ? [String(dataset[axisId])] : [];
    }))];
}

const mergePluginAxes = (axes: ResolvedAxes, options: C2MPluginOptions): ResolvedAxes => {
    const configuredAxes = options.axes;
    return {
        ...axes,
        x: {...axes.x, ...configuredAxes?.x},
        y: {...axes.y, ...configuredAxes?.y},
        ...(axes.y2 ? {y2: {...axes.y2, ...configuredAxes?.y2}} : {})
    } as ResolvedAxes;
}

const generateAxes = (chart: any, options: C2MPluginOptions): AxisResolution => {
    const xAxisIds = axisIds(chart, "x");
    const yAxisIds = axisIds(chart, "y");

    if(xAxisIds.length > 1){
        return {
            axes: {} as ResolvedAxes,
            secondaryAxisDatasetIndexes: new Set(),
            requiresRefresh: false,
            error: `Unable to connect chart2music to chart. Multiple x-axis IDs are not supported: ${xAxisIds.join(", ")}.`
        };
    }

    if(yAxisIds.length > 2){
        return {
            axes: {} as ResolvedAxes,
            secondaryAxisDatasetIndexes: new Set(),
            requiresRefresh: false,
            error: `Unable to connect chart2music to chart. More than two y-axis IDs are not supported: ${yAxisIds.join(", ")}.`
        };
    }

    const xScale = xAxisIds[0] ? chart.scales[xAxisIds[0]] : chart.scales?.x;
    const yScale = yAxisIds[0] ? chart.scales[yAxisIds[0]] : chart.scales?.y;
    const y2Scale = yAxisIds[1] ? chart.scales[yAxisIds[1]] : undefined;
    const axes: ResolvedAxes = {
        x: {
            ...generateAxisInfo(xScale?.options ?? chart.options?.scales?.x, chart),
        },
        y: {
            format: options?.axes?.y?.format || ((value: number) => value.toLocaleString()),
            ...generateAxisInfo(yScale?.options ?? chart.options?.scales?.y, chart),
        }
    };

    if(y2Scale){
        axes.y2 = {
            format: options?.axes?.y2?.format || ((value: number) => value.toLocaleString()),
            ...generateAxisInfo(y2Scale.options, chart),
        };
    }

    const xAxisValueLabels = xScale?.getLabels?.() ?? chart.data.labels?.slice(0) ?? [];
    if(xAxisValueLabels.length > 0){
        axes.x.valueLabels = xAxisValueLabels;
    }

    return {
        axes: mergePluginAxes(axes, options),
        secondaryAxisDatasetIndexes: y2Scale ? new Set(chart.data.datasets.flatMap((_dataset: unknown, index: number) => {
            return chart.getDatasetMeta(index).yScale?.id === y2Scale.id ? [index] : [];
        })) : new Set(),
        requiresRefresh: xAxisIds.some((id) => id !== "x") || yAxisIds.some((id) => id !== "y")
    };
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

const labelIndex = (labels: string[], value: string) => {
    let index = labels.indexOf(value);
    if(index === -1){
        labels.push(value);
        index = labels.length - 1;
    }
    return index;
}

const processMatrixDataPoints = (data: any[], datasetIndex: number, xLabels: string[], yLabels: string[]) => {
    return data.map((point: any, index: number) => {
        const x = typeof point.x === "string" ? labelIndex(xLabels, point.x) : point.x;
        const y = typeof point.y === "string" ? labelIndex(yLabels, point.y) : point.y;
        return {
            ...point,
            x,
            y,
            custom: {
                ...point.custom,
                group: datasetIndex,
                datasetIndex,
                index
            }
        };
    });
}

const processMatrixData = (data: any) => {
    const xLabels: string[] = [];
    const yLabels: string[] = [];

    // Chart2Music represents matrix rows as groups and columns as points within
    // each group. This preserves two-dimensional keyboard navigation.
    const result = {} as Record<string, any[]>;
    data.datasets.forEach((obj: any, index: number) => {
        const points = processMatrixDataPoints(obj.data, index, xLabels, yLabels);
        points.forEach((point: any) => {
            const rowLabel = typeof point.y === "number" && yLabels[point.y] !== undefined
                ? yLabels[point.y]
                : String(point.y);
            const groupName = data.datasets.length === 1
                ? rowLabel
                : `${obj.label ?? `Group ${index + 1}`}: ${rowLabel}`;
            if(!result[groupName]){
                result[groupName] = [];
            }
            result[groupName].push(point);
        });
    });

    Object.values(result).forEach((row) => row.sort((a, b) => a.x - b.x));
    return {groups: Object.keys(result), data: result, xLabels, yLabels};
}

const useSecondaryAxis = (data: any[]) => {
    return data.map((point, index) => {
        if(typeof point === "number"){
            return {x: index, y2: point};
        }
        if(typeof point !== "object" || point === null || Array.isArray(point)){
            return point;
        }
        if(point.y === undefined){
            return point;
        }

        const {y, ...values} = point;
        return {x: values.x ?? index, ...values, y2: y};
    });
}

const errorBarDatasetIndexes = (chart: Chart) => {
    const chartType = chart.config.type;
    return new Set(chart.data.datasets.flatMap((dataset, index) => {
        return (dataset.type ?? chartType) === "barWithErrorBars" ? [index] : [];
    }));
}

const normalizeChartErrorBarBounds = (chart: Chart) => {
    const chartType = chart.config.type;
    chart.data.datasets.forEach((dataset) => {
        if((dataset.type ?? chartType) === "barWithErrorBars"){
            dataset.data = normalizeErrorBarBounds(dataset.data as any[]) as never;
        }
    });
}

const scrubX = (data: any) => {
    const blackboard = JSON.parse(JSON.stringify(data));

    let labels: string[] = [];
    if(Array.isArray(data)){
        // console.log("not grouped");
        // Not grouped
        blackboard.forEach((item: any, x: number) => {
            if(typeof item === "object" && item !== null && "x" in item){
                labels.push(item.x);
                item.x = x;
            }
        });
        return {labels, data: blackboard};

    }else{
        // Grouped
        return undefined;
    }
}

const processData = (data: any, c2m_types: string, errorBars = new Set<number>(), secondaryAxisDatasets = new Set<number>()) => {
    if(c2m_types === "box"){
        return processBoxData(data);
    }
    if(c2m_types === "matrix"){
        return processMatrixData(data);
    }
    let groups: string[] = [];

    const processValues = (values: any[], datasetIndex: number) => {
        const converted = errorBars.has(datasetIndex) ? convertErrorBarData(values) : values;
        const axisData = secondaryAxisDatasets.has(datasetIndex) ? useSecondaryAxis(converted) : converted;
        return whichDataStructure(axisData);
    };
    if(data.datasets.length === 1){
        return {
            data: processValues(data.datasets[0].data, 0)
        }
    }

    const result = {} as Record<string, any>;

    data.datasets.forEach((obj: any, index: number) => {
        const groupName = obj.label ?? `Group ${index+1}`;
        groups.push(groupName);

        result[groupName] = processValues(obj.data, index);
    });

    return {groups, data: result};
}

const titleText = (text: unknown) => {
    if(Array.isArray(text)){
        return text.filter((line): line is string => typeof line === "string").join(", ");
    }
    return typeof text === "string" ? text : "";
}

const determineChartTitle = (options: ChartOptions) => {
    return [
        titleText(options.plugins?.title?.text),
        titleText(options.plugins?.subtitle?.text)
    ].filter(Boolean).join(", ");
}

const determineCCElement = (canvas: HTMLCanvasElement, provided?: HTMLElement | null) => {
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
        labels: chart.data.labels,
        title: determineChartTitle(chart.options)
    });
}

const displayPoint = (chart: Chart) => {
    if(!chartStates.has(chart)){
        return;
    }

    // Word-cloud controllers lay out words during chart updates. Updating only
    // to mirror Chart2Music focus makes the cloud jump away from the user.
    if(chart.config.type === "wordCloud"){
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
            const customPoint = point as typeof point & { custom: CustomDataPoint };
            highlightElements.push({
                datasetIndex: customPoint.custom.datasetIndex ?? customPoint.custom.group,
                index: customPoint.custom.index
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
        chart?.tooltip?.setActiveElements(highlightElements, {} as Point)
        chart?.update();
    }catch(e){
        // console.warn(e);
    }
}

export type C2MPluginOptions = Pick<C2MChartConfig, "audioEngine" | "axes" | "cc" | "lang" | "options"> & {
    errorCallback?: (err: string) => void;
}

const generateChart = (chart: Chart, options: C2MPluginOptions) => {
    const {valid, c2m_types, invalidType} = processChartType(chart);

    if(!valid){
        options.errorCallback?.(`Unable to connect chart2music to chart. The chart is of type "${invalidType}", which is not one of the supported chart types for this plugin. This plugin supports: ${Object.keys(chartjs_c2m_converter).join(", ")}`);
        return;
    }

    const axisResolution = generateAxes(chart, options);
    if(axisResolution.error){
        options.errorCallback?.(axisResolution.error);
        return;
    }
    let axes = axisResolution.axes;

    if((chart.config as ChartConfiguration).type === "wordCloud" as keyof ChartTypeRegistry){
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

    const processedData: any = processData(
        chart.data,
        c2m_types,
        errorBarDatasetIndexes(chart),
        axisResolution.secondaryAxisDatasetIndexes
    );
    const {data} = processedData;
    // lastDataObj = JSON.stringify(data);

    if(c2m_types === "matrix"){
        if(processedData.xLabels?.length > 0){
            axes.x.valueLabels = processedData.xLabels.slice(0);
        }
        if(processedData.yLabels?.length > 0){
            // Category labels provide the Matrix Plot's Y-axis formatter.
            // The general numeric formatter would otherwise announce row indexes.
            delete axes.y.format;
            axes.y.valueLabels = processedData.yLabels.slice(0);
        }
    }

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

    // Start with plugin's internal onFocusCallback
    const pluginOnFocusCallback = () => {
        displayPoint(chart);
    };

    // Merge user's options, wrapping onFocusCallback if provided
    const userOptions = options.options || {};
    const userOnFocusCallback = userOptions.onFocusCallback;

    const c2mOptions: C2MChartConfig = {
        cc,
        element: chart.canvas,
        type: c2m_types,
        data: scrub?.data ?? data,
        title: determineChartTitle(chart.options),
        axes,
        options: {
            ...userOptions,
            onFocusCallback: userOnFocusCallback
                ? (point: any) => {
                    pluginOnFocusCallback();
                    userOnFocusCallback(point);
                }
                : pluginOnFocusCallback
        }
    };

    if(Array.isArray(c2mOptions.data)){
        if(isNaN(c2mOptions.data[0] as any)){
            c2mOptions.data = (c2mOptions.data as any).map((point: any, index: number) => {
                return {
                    ...point,
                    custom: {
                        ...point.custom,
                        group: point.custom?.group ?? 0,
                        index: point.custom?.index ?? index
                    }
                }
            }) as DataSet;
        }else{
            c2mOptions.data = (c2mOptions.data as any).map((num: any, index: number) => {
                return {
                    x: index,
                    y: num,
                    custom: {
                        group: 0,
                        index
                    }
                }
            }) as DataSet;
        }
    }else{
        const dataObj = c2mOptions.data as any;
        const groups = Object.keys(dataObj);
        groups.forEach((groupName, groupNumber) => {
            if(!isNaN(dataObj[groupName][0])){
                dataObj[groupName] = (dataObj[groupName] as number[]).map((num, index) => {
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
                dataObj[groupName] = (dataObj[groupName] as any).map((point: any, index: number) => {
                    return {
                        ...point,
                        custom: {
                            ...point.custom,
                            group: point.custom?.group ?? groupNumber,
                            index: point.custom?.index ?? index
                        }
                    }
                })
            }
        });
    }

    if((chart.config.options?.scales?.x as CartesianScaleOptions)?.stacked){
        if(c2mOptions.options){
            c2mOptions.options.stack = true;
        }
    }

    if(options.audioEngine){
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
        options.errorCallback?.(err);
        return;
    }

    if(!c2m){
        return;
    }

    chartStates.set(chart, {
        c2m,
        lastDataSnapshot: createDataSnapshot(chart),
        axesResolved: false,
        cc,
        title: determineChartTitle(chart.options)
    });

    if(c2m_types === "matrix"){
        const matrixKeydown = (event: KeyboardEvent) => {
            if(event.key !== "ArrowUp" && event.key !== "ArrowDown"){
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            const actions = (c2m as any)._availableActions;
            if(event.key === "ArrowUp"){
                actions.next_category();
            }else{
                actions.previous_category();
            }
        };
        chart.canvas.addEventListener("keydown", matrixKeydown, true);
        const state = chartStates.get(chart) as ChartStatesTypes;
        state.matrixKeydown = matrixKeydown;
        state.matrixKeydownTarget = chart.canvas;
    }

}

const plugin: Plugin = {
    id: "chartjs2music",

    beforeUpdate: (chart: Chart) => {
        normalizeChartErrorBarBounds(chart);
    },

    afterInit: (chart: Chart, _args, options: C2MPluginOptions) => {
        if(!chartStates.has(chart)){
            generateChart(chart, options);
        }

        // Remove tooltip when the chart blurs
        chart.canvas.addEventListener("blur", () => {
            chart.setActiveElements([]);
            chart.tooltip?.setActiveElements([], {} as Point);
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
    },

    afterDatasetUpdate: (chart: Chart, args, options: C2MPluginOptions) => {
        if(!args.mode){
            return;
        }

        if(!chartStates.has(chart)){
            generateChart(chart, options);
        }

        const {c2m: ref} = chartStates.get(chart) ?? {};
        if(!ref){
            return;
        }

        const refInternal = ref as any;
        const groups = refInternal._groups.slice(0);
        if(refInternal._options.stack){
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

    afterUpdate: (chart: Chart, _args, options: C2MPluginOptions) => {
        const state = chartStates.get(chart);
        if(!state?.c2m){
            generateChart(chart, options);
            return;
        }

        // Check if data has changed
        const currentSnapshot = createDataSnapshot(chart);
        if(state.axesResolved && currentSnapshot === state.lastDataSnapshot) {
            return; // No data change, skip update
        }

        const title = determineChartTitle(chart.options);
        if(title !== state.title){
            state.c2m.cleanUp();
            chartStates.delete(chart);
            generateChart(chart, {...options, cc: state.cc});
            return;
        }

        // Get chart type
        const {valid, c2m_types} = processChartType(chart);
        if(!valid) return;

        // Process data and generate axes
        const axisResolution = generateAxes(chart, options);
        if(axisResolution.error){
            options.errorCallback?.(axisResolution.error);
            return;
        }
        if(!axisResolution.requiresRefresh && currentSnapshot === state.lastDataSnapshot){
            state.axesResolved = true;
            return;
        }
        const {data} = processData(
            chart.data,
            c2m_types,
            errorBarDatasetIndexes(chart),
            axisResolution.secondaryAxisDatasetIndexes
        );

        // Update Chart2Music with new data
        state.c2m.setData(data, axisResolution.axes);

        // Update snapshot
        state.lastDataSnapshot = currentSnapshot;
        state.axesResolved = true;
    },

    afterDestroy: (chart) => {
        const state = chartStates.get(chart);
        if(!state?.c2m){
            return;
        }
        const {c2m: ref} = state;

        if(state?.matrixKeydown && state.matrixKeydownTarget){
            state.matrixKeydownTarget.removeEventListener("keydown", state.matrixKeydown, true);
        }
        ref.cleanUp();
    },

    defaults: {
        cc: null,
        audioEngine: null,
        errorCallback: null,
        options: {}
    }

};

export default plugin;
