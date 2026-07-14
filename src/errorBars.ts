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

        const y = values.y;
        const low = yMin === undefined ? y : errorBarBound(yMin);
        const high = yMax === undefined ? y : errorBarBound(yMax);

        return {
            ...values,
            x: values.x ?? index,
            low,
            high
        };
    });
}
