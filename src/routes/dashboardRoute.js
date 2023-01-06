const router=require('express').Router()

const {getDashboard,getDayReport,getMonthReport}=require('./../controllers/dashboardController')

const{authenticatedUser,isAdmin}=require('./../middlewares/authMiddleware')

router.get('/day',authenticatedUser,isAdmin,getDayReport)
router.get('/month',authenticatedUser,isAdmin,getMonthReport)
router.get('/', authenticatedUser, getDashboard)

module.exports= router