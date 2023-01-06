function mergeMonthById(arr1,arr2){
    const result =[];
    arr1.forEach(element => {
        result.push(element)
    });

    arr2.forEach(obj2=>{
        const existingObj = result.find(obj1 => obj1._id.year === obj2._id.year && obj1._id.month === obj2._id.month);
        if(existingObj){
            Object.assign(existingObj,obj2);
        }else{
            result.push(obj2);
        }
    })
    return result;
}
function mergeDayById(arr1,arr2){
    const result =[];
    arr1.forEach(element => {
        result.push(element)
    });

    arr2.forEach(obj2=>{
        const existingObj = result.find(obj1 => obj1._id === obj2._id);
        if(existingObj){
            Object.assign(existingObj,obj2);
        }else{
            result.push(obj2);
        }
    })
    return result;
}
function mergeById(arr1,arr2){
    const result =[];
    arr1.forEach(element => {
        result.push(element)
    });

    arr2.forEach(obj2=>{
        const existingObj = result.find(obj1 => JSON.stringify(obj1._id) === JSON.stringify(obj2._id));
        if(existingObj){
            Object.assign(existingObj,obj2);
        }else{
            result.push(obj2);
        }
    })
    return result;
}

module.exports ={mergeMonthById,mergeDayById,mergeById}