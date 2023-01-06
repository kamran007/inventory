const Sale = require('../models/sale')
const mongoose = require('mongoose');
const Flash = require('../utilities/Flash');
module.exports.getIndividualAccount = async(req,res)=>{
    let {id}= req.params;
    try {
        let accountDetails = await Sale.aggregate([
            {
                $match:{
                    saleTo: mongoose.Types.ObjectId(id)
                }
            },
            {
                $group:{
                    _id: '$saleTo',
                    totalPayable: { $sum : '$payable'},
                    totalDiscount: { $sum : '$discount'},
                    totalPaid: { $sum : '$paid'},
                    totalDue: { $sum : '$due'},
                }
            },
            {
                $lookup:{
                    localField: '_id',
                    foreignField: '_id',
                    from: 'stockholders',
                    as: 'customer'
                }
            }
        ])
        console.log(accountDetails);
        return res.render('pages/account',{
            title: 'Account',
            accountDetails,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getAllAccounts = async(req,res)=>{
    try {
        let accountDetails = await Sale.aggregate([
            {
                $group:{
                    _id: '$saleTo',
                    totalPayable: { $sum : '$payable'},
                    totalDiscount: { $sum : '$discount'},
                    totalPaid: { $sum : '$paid'},
                    totalDue: { $sum : '$due'},
                }
            },
            {
                $lookup:{
                    localField: '_id',
                    foreignField: '_id',
                    from: 'stockholders',
                    as: 'customer'
                }
            }
        ])
        console.log(accountDetails);
        return res.render('pages/account',{
            title: 'Account',
            accountDetails,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}