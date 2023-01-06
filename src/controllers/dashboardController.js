const Flash=require('./../utilities/Flash')
const {showMonthName,showDayOfWeekName} = require('../utilities/dateFormatter')
const {getSummaryByMonth,getSummary} = require('../businessLogics/monthSummary')
const {getSummaryDayToDay,getDaySummary} = require('../businessLogics/daySummary')
const Sale = require('../models/sale')
const Payment = require('../models/payment')
const Check = require('../models/check')

module.exports.getDashboard=async(req,res)=>{
    try {
        let dataFormat={
            _id: null,
            totalPayable:0,
            totalPaid:0,
            totalDue:0,
            totalCost:0,
            totalPrice:0,
            additionalCost:0
        }
        let date= new Date();
        let currentMonth = date.getMonth()+1
        let currentYear = date.getFullYear()
        let month= showMonthName(date.getMonth()+1)
        let day = showDayOfWeekName()
        // Month Summary
        let summary= await getSummaryByMonth(currentMonth,currentYear)
        if(summary.length === 0){
            summary =[dataFormat]
        }
        //day Summary
        let daySummary = await getSummaryDayToDay(date,date)
        if(daySummary.length === 0){
            daySummary =[dataFormat]
        }
        //week Summary
        let fromDate = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()-7}`)
        let weekSummary = await getSummaryDayToDay(fromDate,date)

        //sales Table
        let sales=await Sale.find().populate([{
            path:'saleTo', 
            select: '_id name',
            model: 'Stockholder'
        },
        {
            path: 'saleBy', 
            select: 'username', 
            model: 'User'
        },{
            path: 'item.itemId',
            select: 'productName unitType',
            model: 'Product'
        }]).sort([['date',-1]])

        // payment Method
        let payments = await Payment.aggregate([
            {
                $group:{
                    _id:{
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        paymentType: '$paymentType'
                    },
                    amount:{
                        $sum: '$amount'
                    }
                }
            },
            {
                $sort:{
                    '_id.date': -1,
                    '_id.paymentType': -1
                }
            },
            {
                $limit: 100
            }
        ])

        //Upcomming Check
        let checks = await Check.find().sort([['depositDate',-1]])
        return res.render('pages/dashboard.ejs',{
            title: 'Dashboard',
            summary: summary[0],
            daySummary: daySummary[0],
            weekSummary,
            day,
            month,
            sales,
            payments,
            checks,
            flashMessage:Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getDayReport = async(req,res)=>{
    try {
        let summarys = await getDaySummary()
        return res.render('pages/report',{
            title: 'Day Report',
            summarys,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}
module.exports.getMonthReport = async(req,res)=>{
    try {
        let summarys = await getSummary()
        return res.render('pages/report',{
            title: 'Month Report',
            summarys,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}