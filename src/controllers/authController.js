const bcrypt=require('bcrypt')
const {validationResult}=require('express-validator')

const User=require('./../models/user')
const errorFormatter=require('./../utilities/validationErrorFormatter')
const Flash=require('./../utilities/Flash')
const Employee = require('../models/employee')

module.exports.getUserList = async(req,res)=>{
    try {
        const users = await User.find().populate([{
            path: 'profile',
            select: 'name designation',
            model: Employee
        }]).sort([['createdAt',-1]])
        return res.render('pages/user',{
            title: 'User List',
            users,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getChangePasswordForm = (req,res)=>{
    return res.render('pages/changePassword',{
        title: "Change Password",
        errors:{},
        flashMessage: Flash.getMessage(req)
    })
}
module.exports.postChangePasswordForm = async (req,res)=>{
    let {password} = req.body;
    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        req.flash('fail','Check Your Form');
        return res.render('pages/changePassword',{
            title: "Change Password",
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }
    try {
        let hassedPassword= await bcrypt.hash(password,13)
        let id = req.session.user._id
        await User.findOneAndUpdate({_id:id},{ password:hassedPassword},{new:true})
        req.flash('success','Password Changed Successfully')
        res.redirect('/auth/change')
    } catch (e) {
        console.log(e);
        req.flash('fail','Server Error')
        res.redirect('/auth/change')
    }
}

module.exports.deleteUser = async(req,res)=>{
    try {
        let {id}= req.params
        await User.findOneAndDelete({_id:id})
        req.flash('success','User Deleted Successfully')
        res.redirect('/auth/user')
    } catch (e) {
        req.flash('fail','Server Error')
        res.redirect('/auth/user')
    }
}

module.exports.getSignupController=async (req,res)=>{
    try {
        const employees = await Employee.find().select('_id name designation')
        return res.render('pages/userRegistration',{
            title:'Employee Registration',
            errors:{},
            employees,
            flashMessage: Flash.getMessage(req)
        })
    } catch (e) {
        console.log(e);
    }
}
module.exports.postSignupController= async (req,res)=>{
    let {username, password, role,employee }=req.body
    console.log(employee);
    let errors=validationResult(req).formatWith(errorFormatter)
    const employees = await Employee.find().select('_id name designation')
    if(!errors.isEmpty()){
        req.flash('fail','Check Your form')
        return res.render('pages/userRegistration.ejs',{
            title: "Employee Registration",
            errors: errors.mapped(),
            employees,
            flashMessage: Flash.getMessage(req)
        })
    }

    try{
        let hassedPassword= await bcrypt.hash(password,13)
        let user=new User({
            username,
            password: hassedPassword,
            role,
            profile:employee
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
        // req.flash('success',`Mr. ${user.username} successfully log in`)
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
        }
        else{
            res.redirect('/auth/login')
        }
    })
}