const ImportOrder = require('../models/importOrder')
const Cost = require('../models/cost')
const Sale = require('../models/sale')
const {mergeDayById} = require('../utilities/mergeArrayOfObject')

const getImportOrderSummary =async ()=>{
    try {
        let importSummaryByDay =await ImportOrder.aggregate([
            {
                $group:{
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalCost:{$sum: "$totalCost"},
                    totalPrice:{$sum: '$totalPrice'}
                }
            },
            {
                $sort:{
                    '_id': -1,
                }
            },
            {
                $limit: 100,
            }
        ])
        return importSummaryByDay
    } catch (e) {
        console.log(e);
    }
}

const getSaleSummary = async()=>{
    try {
        let saleSummaryByDay =await Sale.aggregate([
            {
                $group:{
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalPayable:{
                        $sum: '$payable'
                    },
                    totalPaid:{
                        $sum: '$paid'
                    },
                    totalDue:{
                        $sum: '$due'
                    },
                    totalProfit:{
                        $sum: '$totalProfit'
                    }
                }
            },
            {
                $sort:{
                    '_id': -1,
                }
            },
            {
                $limit: 100,
            }
        ])
        return saleSummaryByDay;
    } catch (e) {
        console.log(e);
    }
}

let getAdditionalCostSummary = async()=>{
    try {
        let additionalCostSummaryByDay = await Cost.aggregate([
            {
                $group:{
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    additionalCost:{
                        $sum: '$amount'
                    }
                }
            },
            {
                $sort:{
                    '_id': -1
                }
            },
            {
                $limit: 100,
            }
        ])
        return additionalCostSummaryByDay
    } catch (e) {
        console.log(e);
    }
}

const getDaySummary = async()=>{
    try {
        let saleSummary = await getSaleSummary()
        let costSummary = await getAdditionalCostSummary()
        let importSummary = await getImportOrderSummary()
        let s = mergeDayById(saleSummary,importSummary)
        let summary = mergeDayById(s,costSummary)
        let d = []
        summary.forEach(obj => {
            let data = {}
            data["_id"] = obj._id
            data["totalPayable"] = obj.totalPayable? obj.totalPayable : 0
            data["totalPaid"] = obj.totalPaid? obj.totalPaid : 0
            data["totalDue"] = obj.totalDue? obj.totalDue : 0
            data["totalProfit"] = obj.totalProfit? obj.totalProfit : 0
            data["totalCost"] = obj.totalCost? obj.totalCost : 0
            data["totalPrice"] = obj.totalPrice? obj.totalPrice : 0
            data["additionalCost"] = obj.additionalCost? obj.additionalCost : 0
            d.push(data)
        });
    return d
    } catch (e) {
        console.log(e);
    }
}
const getSummaryDayToDay= async(dayFrom,dayTo)=>{
    let summary = await getDaySummary();
    let to = new Date(dayTo)
    let from = new Date(dayFrom)
    const day1 = new Date(`${from.getFullYear()}-${from.getMonth()+1}-${from.getDate()}`)
    const day2 = new Date(`${to.getFullYear()}-${to.getMonth()+1}-${to.getDate()+1}`)
    let d = summary.filter(item => (new Date(item._id) >= day1)&& (new Date(item._id) <= day2))
    return d
}
module.exports = {
    getDaySummary,
    getSummaryDayToDay
}