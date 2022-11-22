const {body}=require('express-validator')
const Stockholder=require('./../../models/stockholder')

module.exports=[
    body('name')
    .isLength({min:2,max:15}).withMessage("Name must be between 2 to 15 characters")
    .custom(async name=>{
        let user=await Stockholder.findOne({name})
        if(user){
            return Promise.reject("Name Already Used")
        }
    })
    .trim(),
    body('country')
    .isLength({min:1}).withMessage("Country is required"),
    body('type')
    .isLength({min:1}).withMessage("Stockholder either be buyer or seller"),
    body('phone')
    .isLength({min:1}).withMessage("Phone number must not be empty"),
    body('email')
    .isLength({min:1}).withMessage("Email must not be empty")
]