const Flash=require('./../utilities/Flash')
const Product=require('./../models/product')
const {validationResult} = require('express-validator')
const errorFormatter = require('./../utilities/validationErrorFormatter')

module.exports.getProductInsertForm=(req,res)=>{
    res.render('pages/productInsertForm',{
        title: "Product",
        errors:{},
        flashMessage:Flash.getMessage(req)

    })
}
module.exports.postProductInsertForm=(req,res)=>{
    let {productName,price,unitType}=req.body
    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        req.flash('fail','Check Your Form')
        return res.render('pages/productInsertForm',{
            title: "Product Entry",
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }
    try{
        let product=new Product({
            productName,
            price,
            unitType
        })
        product.save()
        req.flash('success',`New ${productName} is added`)
        res.redirect('/product/insert')
    }
    catch(e){
        console.log(e)
    }

}

module.exports.getAllProduct= async (req,res)=>{
    try{
        let products= await Product.find()
        res.render('pages/product',{
            title: 'Product',
            products,
            errors:{},
            flashMessage:Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e)
    }
}
module.exports.updateProduct= async (req,res)=>{
    try{
        let {
            id,
            productName,
            price,
            stock,
            unitType
        }=req.body
        await Product.findOneAndUpdate(
            {
                _id:id
            },{
                $set:{
                    productName,
                    price,
                    stock,
                    unitType
                }
            },{
                new: true
            }
        )
        req.flash('success',`${productName} is updated`)
        res.redirect('/dashboard')

    }
    catch(e){
        console.log(e)
    }
}

module.exports.deleteProduct=async (req,res)=>{
    try{
        let {id}=req.params
        await Product.findOneAndDelete({_id:id})
        req.flash('success','Product Deleted')
        res.redirect('/dashboard')
    }
    catch(e){
        console.log(e)
    }
}