const ImportOrder = require('../models/importOrder')
const Cost = require('../models/cost')
const Sale = require('../models/sale')
const {mergeMonthById} = require('../utilities/mergeArrayOfObject')

const getImportOrderSummary =async ()=>{
    try {
        let importSummaryByMonth =await ImportOrder.aggregate([
            {
                $group:{
                    _id:{
                        year:{
                            $year: '$date'
                        },
                        month:{
                            $month: '$date'
                        }
                    },
                    totalCost:{$sum: "$totalCost"},
                    totalPrice:{$sum: '$totalPrice'}
                }
            },
            {
                $sort:{
                    '_id.year': -1,
                    '_id.month': -1
                }
            },
            {
                $limit: 100,
            }
        ])
        return importSummaryByMonth
    } catch (e) {
        console.log(e);
    }
}

const getSaleSummary = async()=>{
    try {
        let saleSummaryByMonth =await Sale.aggregate([
            {
                $group:{
                    _id:{
                        year:{
                            $year: '$date'
                        },
                        month:{
                            $month: '$date'
                        }
                    },
                    totalPayable:{
                        $sum: '$payable'
                    },
                    totalPaid:{
                        $sum: '$paid'
                    },
                    totalDue:{
                        $sum: '$due'
                    },
                    totalProfit: {
                        $sum: '$totalProfit'
                    }
                }
            },
            {
                $sort:{
                    '_id.year': -1,
                    '_id.month': -1
                }
            },
            {
                $limit: 100,
            }
        ])
        return saleSummaryByMonth;
    } catch (e) {
        console.log(e);
    }
}

let getAdditionalCostSummary = async()=>{
    try {
        let additionalCostSummaryByMonth = await Cost.aggregate([
            {
                $group:{
                    _id:{
                        year:{ $year: '$date'},
                        month:{ $month: '$date'}
                    },
                    additionalCost:{
                        $sum: '$amount'
                    }
                }
            },
            {
                $sort:{
                    '_id.year': -1,
                    '_id.month': -1
                }
            },
            {
                $limit: 100,
            }
        ])
        return additionalCostSummaryByMonth
    } catch (e) {
        console.log(e);
    }
}

const getSummary = async()=>{
    try {
        let saleSummary = await getSaleSummary()
        let costSummary = await getAdditionalCostSummary()
        let importSummary = await getImportOrderSummary()
        let s = mergeMonthById(saleSummary,importSummary)
        let summary = mergeMonthById(s,costSummary)
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
const getSummaryByMonth= async(month,year)=>{
    let summary = await getSummary();
    let data = summary.filter(item=> (item._id.year === year) && (item._id.month === month))
    return data
}
module.exports = {
    getSummary,
    getSummaryByMonth
}