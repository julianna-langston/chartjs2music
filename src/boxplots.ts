const calcMedian = (nums: number[]) => (nums.length % 2) ? nums[Math.floor(nums.length/2)] : (nums[nums.length/2] + nums[nums.length/2-1])/2;

const fiveNumberSummary = (nums: number[]) => {
    const sortedNumbers = nums.sort();

    let min: number, max: number, q1: number, q3: number;

    const datamin = Math.min(...sortedNumbers);
    const datamax = Math.max(...sortedNumbers);
    const median = calcMedian(sortedNumbers);

    const length = sortedNumbers.length;
    if(length % 2){
        q1 = calcMedian(sortedNumbers.slice(0, Math.floor(length/2)));
        q3 = calcMedian(sortedNumbers.slice(Math.ceil(length%2)));
    }else{
        q1 = calcMedian(sortedNumbers.slice(0, length/2-1));
        q3 = calcMedian(sortedNumbers.slice(length/2));
    }
    const iqr = q3-q1;
    if(datamax < q3+iqr){
        max = datamax;
    }else{
        max = sortedNumbers.reverse().find((num) => num < datamax) ?? datamax;
    }

    if(datamin < q1-iqr){
        min = datamin;
    }else{
        min = sortedNumbers.reverse().find((num) => num < datamin) ?? datamin;
    }

    const outlier = sortedNumbers.filter((num) => num < min || num > max);

    return {
        low: min,
        high: max,
        median,
        q1,
        q3,
        ...(outlier.length > 0 ? {outlier} : {})
    }
}

const whichBoxData = (data: any) => {
    return data.map((row: any, index: number) => {
        if(typeof row === "object" && "min" in row){
            return {
                ...row,
                low: row.min,
                high: row.max,
                x: index,
                ...("outliers" in row ? {outlier: row.outliers} : {})
            };
        }

        if(Array.isArray(row)){
            return {
                ...fiveNumberSummary(row),
                x: index
            };
        }
    })
}

export const processBoxData = (data) => {
    
    if(data.datasets.length === 1){
        return {
            data: whichBoxData(data.datasets[0].data)
        };
    }
    
    const groups: string[] = [];
    const result = {} as Record<string, any>;
    data.datasets.forEach((obj, index) => {
        const groupName = obj.label ?? `Group ${index+1}`;
        groups.push(groupName);

        result[groupName] = whichBoxData(obj.data);
    });
    return {groups, data: result};
}