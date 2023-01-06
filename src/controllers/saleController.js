const converter = require('number-to-words');
const Stockholder = require('../models/stockholder')
const User=require('../models/user')
const Product = require('../models/product')
const Sale = require('../models/sale')
const Check = require('../models/check')
const Payment = require('../models/payment')
const {getStock} = require('../businessLogics/StockCalculation')

const Flash = require('../utilities/Flash')

module.exports.getAllSale = async (req, res) => {
    try{
        let sales=await Sale.find().populate([{
            path:'saleTo', 
            select: '_id name',
            model: Stockholder
        },
        {
            path: 'saleBy', 
            select: 'username', 
            model: User
        },{
            path: 'item.itemId',
            select: 'productName unitType',
            model: Product
        }]).sort([['date',-1]])
        res.render('pages/sale',{
            title: "Sale",
            sales,
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
        let products = await getStock()
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
    let { customer,itemId, itemPrice, itemUnit, itemTotal, totalProfit, payable, discount, paid, due, date, paymentType,paymentRef,depositDate,comment} = req.body
    try {
        let it_id = Object.values(itemId)[0].split(',')
        let u = Object.values(itemUnit)[0].split(',')
        let p = Object.values(itemPrice)[0].split(',')
        let t = Object.values(itemTotal)[0].split(',')
        let t_p =totalProfit.split(',')
        let sum =0;
        let list = []
        for (let n = 0; n < it_id.length; n++) {
            let singleObj = {}
            singleObj['itemId'] = it_id[n]
            // singleObj['ProductName'] = i[n]
            singleObj['price'] = Number(p[n])
            singleObj['quantity'] = Number(u[n])
            singleObj['total'] = Number(t[n])
            let i_p= parseFloat(t_p[n])
            sum +=i_p;
            singleObj['profit'] = i_p
            list.push(singleObj)
        }
        let payment = new Payment({
            paymentType,
            amount: paid
        })
        let newPayment = await payment.save()
        let sale = new Sale({
            saleTo: customer,
            saleBy: req.session.user._id,
            item: list,
            payable,
            discount,
            paid,
            due,
            totalProfit:sum-discount,
            payment:[{individualPayment: newPayment._id}],
            date,
            comment
        })
        let newSale = await sale.save();
        if(paymentType === 'Check'){
            const check = new Check({
                invoice: newSale._id,
                checkInfo: paymentRef,
                depositDate
            })
            await check.save();
        }
        req.flash('success', 'New Sale Added')
        res.redirect('/sale/insert')

    }
    catch (e) {
        console.log(e);
        req.flash('fail', 'internal error')
        res.redirect('/sale/insert')
    }
}

module.exports.postAddPament = async(req,res)=>{
    let {id}= req.params
    let {paymentType,paymentRef,depositDate,amount} = req.body
    try {
        let payment = new Payment({
            paymentType,
            amount
        })
        let newPayment = await payment.save()
        let individualPayment ={
            individualPayment:newPayment._id
        }
        await Sale.findByIdAndUpdate(
            {
                _id:id
            },
            {
                $inc:
                {
                    paid: amount,
                    due: -amount
                },
                $push:{
                    payment: individualPayment
                }
        })
        if(paymentType === 'Check'){
            const check = new Check({
                invoice: newSale._id,
                checkInfo: paymentRef,
                depositDate
            })
            await check.save();
        }
        req.flash('success','New Payment Added')
        res.redirect(`/sale/${id}`)
    } catch (e) {
        console.log(e);
    }
}

module.exports.getIndivisualSale = async (req,res)=>{
    let {id} = req.params;
    try {
        let sale = await Sale.findOne({_id:id}).populate([
            {
                path: 'saleTo',
                select: '_id name address',
                model: 'Stockholder'
            },
            {
                path: 'payment.individualPayment',
                select: '_id paymentType amount createdAt',
                model: 'Payment'
            },
            {
                path: 'item.itemId',
                select: 'productName unitType',
                model: Product
            }
        ])
        let word = converter.toWords(sale.payable-sale.discount)
        res.render('pages/saleDetail',{
            title: 'Invoice',
            sale,
            word,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        
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