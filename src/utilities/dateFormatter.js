
const showMonthName = (num)=>{
    let m = new Date();
    m.setMonth(num-1)
    return m.toLocaleString('en-Us',{month:'long'})
}

const showDayOfWeekName = ()=>{
    return new Date().toLocaleString('en-Us',{weekday:'long'})
}

module.exports={
    showMonthName,
    showDayOfWeekName
}