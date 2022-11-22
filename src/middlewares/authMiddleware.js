const session = require('express-session')
const User = require('../models/user')

module.exports.bindUserRequest=()=>{
    return async (req,res,next)=>{
        if(req.session.isLoggedIn){
            try{
                let user= await User.findOne({_id:req.session.user._id})
                req.user=user
            }
            catch(e){
                console.log(e)
            }
        }
        return next()
    }
}
module.exports.isAdmin =(req,res,next)=>{
    if(req.session.user.role === 'admin'){
        next()
    }else{
        req.flash('fail','You have not enough permission');
        res.redirect('/dashboard')
    }
}
module.exports.authenticatedUser=(req,res,next)=>{
    if(!req.session.isLoggedIn){
        res.redirect('/auth/login')
    }
    else{
        next()
    }
}
module.exports.unAuthenticatedUser=(req,res,next)=>{
    if(req.session.isLoggedIn){
        res.redirect('/dashboard')
    }
    else{
        next()
    }
}