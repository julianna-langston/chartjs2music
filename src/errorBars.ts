const errorBarBound = (value: number | number[]) => Array.isArray(value) ? value[0] : value;

export const convertErrorBarData = (data: any[]) => {
    return data.map((point, index) => {
        if(typeof point !== "object" || point === null || Array.isArray(point)){
            return point;
        }

        const {yMin, yMax, ...values} = point;
        if(yMin === undefined && yMax === undefined){
            return point;
        }

        return {
            ...values,
            x: values.x ?? index,
            ...(yMin === undefined ? {} : {low: errorBarBound(yMin)}),
            ...(yMax === undefined ? {} : {high: errorBarBound(yMax)})
        };
    });
}
