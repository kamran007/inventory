const {body}=require('express-validator')
const Product = require('../../models/product')

module.exports =[
    body('productName')
    .isLength({min:1}).withMessage('Product Name is required')
    .custom( async productName =>{
        let product = await Product.findOne({productName})
        if(product){
            return Promise.reject('ProductName Already Exists')
        }
    })
    .trim(),
    body('unitType')
    .isLength({min:1}).withMessage("Product Unit Type is required")
    .trim()
]