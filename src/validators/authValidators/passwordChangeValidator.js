const {body}=require('express-validator')
const User=require('./../../models/user')

module.exports=[
    body('password')
    .isLength({min:5}).withMessage("Password must be greater than 4 characters"),
    body('confirmPassword')
    .custom((confirmPassword,{req})=>{
        if(confirmPassword !== req.body.password){
            throw new Error("Password not Match")
        }
        return true
    })
]