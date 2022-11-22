const {body}=require('express-validator')
const User=require('./../../models/user')

module.exports=[
    body('username')
    .isLength({min:2,max:15}).withMessage("username must be between 2 to 15 characters")
    .custom(async username=>{
        let user=await User.findOne({username})
        if(user){
            return Promise.reject("User Name Already Used")
        }
    })
    .trim(),
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