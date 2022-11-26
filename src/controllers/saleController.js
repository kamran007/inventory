const Stockholder = require('../models/stockholder')
const User=require('../models/user')
const Product = require('../models/product')
const Sale = require('../models/sale')

const Flash = require('../utilities/Flash')
const product = require('../models/product')
module.exports.getAllSale = async (req, res) => {
    try{
        let sales=await Sale.find().populate([{
            path:'saleTo', 
            select: 'name', 
            model: Stockholder
        },
        {
            path: 'saleBy', 
            select: 'username', 
            model: User
        },{
            path: 'item.itemId',
            select: 'productName',
            model: Product
        }])
        let summary = {}
        summary=await Sale.aggregate([{
            $group: {
                _id:null,
                total_payable:{ $sum: "$payable"},
                total_discount:{ $sum: "$discount"},
                total_paid:{ $sum: "$paid"},
                total_due:{ $sum: "$due"},
            }
        }])
        console.log(Object.values(summary)[0]);
        res.render('pages/sale',{
            title: "Sale",
            sales,
            summary: Object.values(summary)[0],
            flashMessage:Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e)
    }
    
}

module.exports.getSaleInsertForm = async (req, res) => {
    try {
        let customers = await Stockholder.find({ 'type': 'customer' }).select('_id name')
        let products = await Product.find().select('_id productName price')
        res.render('pages/saleInsertForm', {
            title: 'Sale',
            customers,
            products,
            errors: {},
            flashMessage: Flash.getMessage(req)
        })
    }
    catch (e) {
        console.log(e)
    }


}
module.exports.postSaleInsertForm = async (req, res) => {
    let { customer, item, itemPrice, itemUnit, itemTotal, payable, discount, paid, due, paymentType,paymentRef,comment} = req.body
    console.log(customer);
    try {
        let i = Object.values(item)[0].split(',')
        let u = Object.values(itemUnit)[0].split(',')
        let p = Object.values(itemPrice)[0].split(',')
        let t = Object.values(itemTotal)[0].split(',')
        let list = []
        for (let n = 0; n < i.length; n++) {
            let singleObj = {}
            singleObj['itemId'] = i[n]
            singleObj['price'] = Number(p[n])
            singleObj['quantity'] = Number(u[n])
            singleObj['total'] = Number(t[n])
            list.push(singleObj)
        }
        let sale = new Sale({
            saleTo: customer,
            saleBy: req.session.user._id,
            item: list,
            payable,
            discount,
            paid,
            due,
            paymentType,
            paymentRef,
            comment
        })
        console.log(sale)
        await sale.save()
        req.flash('success', 'New Sale Added')
        res.redirect('/sale/insert')

    }
    catch (e) {
        req.flash('fail', 'internal error')
        res.redirect('/sale/insert')
    }
}

module.exports.getUpdateSaleForm= async (req,res)=>{
    try {
        let {id}=req.params
        let products = await Product.find().select('_id productName price')
        let sale= await Sale.findOne({_id:id})
        res.render('pages/saleUpdateForm', {
            title: 'Sale',
            sale,
            products,
            errors: {},
            flashMessage: Flash.getMessage(req)
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports.postUpdateForm=async (req,res)=>{
    let { id, item, itemPrice, itemUnit, itemTotal, payable, discount, paid, due } = req.body
    try {
        let i = Object.values(item)[0].split(',')
        let u = Object.values(itemUnit)[0].split(',')
        let p = Object.values(itemPrice)[0].split(',')
        let t = Object.values(itemTotal)[0].split(',')
        let list = []
        for (let n = 0; n < i.length; n++) {
            let singleObj = {}
            singleObj['itemName'] = i[n]
            singleObj['price'] = Number(p[n])
            singleObj['unit'] = Number(u[n])
            singleObj['total'] = Number(t[n])
            list.push(singleObj)
        }
        console.log(JSON.stringify(list))
        
        await Sale.findOneAndUpdate(
            {
                _id:id
            },{
                $set:{
                    item:list,
                    payable,
                    discount,
                    paid,
                    due
                }
            },{
                new: true
            }
        )
        req.flash('success',`Sale ${i} is updated successfully`)
        res.redirect('/sale')
    }
    catch (e) {
        req.flash('fail', 'internal error')
        res.redirect('/sale')
    }
}
module.exports.deleteSale = async(req,res) =>{
    const {id} = req.params;
    try{
        await Sale.findOneAndDelete({_id:id})
        req.flash('success','Sale data Deleted')
        res.redirect('/sale')
    }
    catch(e){
        console.log(e)
    }
}