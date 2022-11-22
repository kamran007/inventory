const router=require('express').Router()

const {getDashboard}=require('./../controllers/dashboardController')

const{authenticatedUser}=require('./../middlewares/authMiddleware')

router.get('/', authenticatedUser, getDashboard)

module.exports= router