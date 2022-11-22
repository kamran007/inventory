const bcrypt=require('bcrypt')
const {validationResult}=require('express-validator')

const User=require('./../models/user')
const errorFormatter=require('./../utilities/validationErrorFormatter')
const Flash=require('./../utilities/Flash')


module.exports.getSignupController=(req,res)=>{
    res.render('pages/userRegistration',{
        title:'Employee Registration',
        errors:{},
        flashMessage: Flash.getMessage(req)
    })
}
module.exports.postSignupController= async (req,res)=>{
    let {username, password, role}=req.body
    let errors=validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        req.flash('fail','Check Your form')
        return res.render('pages/userRegistration.ejs',{
            title: "Employee Registration",
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }

    try{
        let hassedPassword= await bcrypt.hash(password,13)
        let user=new User({
            username,
            password: hassedPassword,
            role
        })
        user.save()
        req.flash('success',"A New Employee Created")
        return res.redirect('/auth/signup')
    }
    catch(e){
        console.log(e)
        return res.redirect('/auth/signup')
    }

}
module.exports.getLoginController=(req,res)=>{
    res.render('pages/login',{
        title:'LogIn',
        errors:{},
        flashMessage:Flash.getMessage(req)
    })
}
module.exports.postLoginController= async (req,res)=>{
    let {username,password}=req.body
    let errors=validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        req.flash('fail','Check your form')
        return res.render('pages/login',{
            title: "Log In",
            errors:errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })  
    }
    try{
        let user= await User.findOne({username})
        if(!user){
            req.flash('fail','Invalid Credentials')
            return res.redirect('/auth/login')
        }
        let match= await bcrypt.compare(password, user.password)
        if(!match){
            req.flash('fail','Invalid Credentials')
            return res.redirect('/auth/login')
        }
        req.session.isLoggedIn=true
        req.session.user=user
        req.flash('success',`Mr. ${user.username} successfully log in`)
        return res.redirect('/dashboard')
    }
    catch(e){
        console.log(e)
    }
    
}

module.exports.logOutControlller=(req,res,nex)=>{
    req.session.destroy(e=>{
        if(e){
            console.log(e)
            return next(e)
        }
       
    })
    return res.redirect('/auth/login')
}