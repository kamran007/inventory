const Cost = require('../models/cost');
const Flash = require('../utilities/Flash');
module.exports.getCostInsertForm = async (req,res)=>{
    try {
        let costs = await Cost.find().sort([['date',-1]])
        return res.render('pages/cost',{
            title: "Cost",
            errors:{},
            costs,
            flashMessage: Flash.getMessage(req)
        })  
    } catch (e) {
        console.log(e);
    }
}

module.exports.postCostInsertForm = async(req,res)=>{
    const {costDescription,amount, date} = req.body
    try {
        const cost = new Cost({costDescription,amount,date})
        await cost.save();
        req.flash('success','New Cost Added');
        res.redirect('/cost/insert')
    } catch (e) {
        req.flash('fail','Server Error');
        res.redirect('/cost/insert')
    }
}  