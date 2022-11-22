
const router=require('express').Router()

const {
    getLoginController,
    getSignupController,
    postLoginController,
    postSignupController,
    logOutControlller
}=require('./../controllers/authController')
const signupValidator = require('./../validators/authValidators/signupValidation')
const loginValidation=require('./../validators/authValidators/loginValidation')

const {authenticatedUser,unAuthenticatedUser, isAdmin}=require('./../middlewares/authMiddleware')

router.get('/signup',authenticatedUser,isAdmin,getSignupController)
router.post('/signup',authenticatedUser,isAdmin ,signupValidator,postSignupController)


router.get('/login',unAuthenticatedUser,getLoginController)
router.post('/login',unAuthenticatedUser,loginValidation ,postLoginController)
router.get('/logout',authenticatedUser, logOutControlller)

module.exports=router