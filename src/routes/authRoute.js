
const router=require('express').Router()

const {
    getLoginController,
    getSignupController,
    postLoginController,
    postSignupController,
    logOutControlller,
    getUserList,
    deleteUser,
    getChangePasswordForm,
    postChangePasswordForm
}=require('./../controllers/authController')
const signupValidator = require('./../validators/authValidators/signupValidation')
const loginValidation=require('./../validators/authValidators/loginValidation')
const passwordChangedValidator= require('../validators/authValidators/passwordChangeValidator')

const {authenticatedUser,unAuthenticatedUser, isAdmin}=require('./../middlewares/authMiddleware')

router.get('/signup',authenticatedUser,isAdmin,getSignupController)
router.post('/signup',authenticatedUser,isAdmin ,signupValidator,postSignupController)

router.get('/user',authenticatedUser,isAdmin,getUserList)
router.get('/delete/:id',authenticatedUser,isAdmin,deleteUser)

router.get('/change',authenticatedUser,getChangePasswordForm)
router.post('/change',authenticatedUser,passwordChangedValidator,postChangePasswordForm)

router.get('/login',unAuthenticatedUser,getLoginController)
router.post('/login',unAuthenticatedUser,loginValidation ,postLoginController)
router.get('/logout',authenticatedUser, logOutControlller)

module.exports=router