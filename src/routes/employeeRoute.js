const router = require('express').Router();
const {authenticatedUser,isAdmin} = require("../middlewares/authMiddleware")
const {
    getEmployeeRegistrationForm,
    postEmployeeRegistrationForm,
    getEmployeeList,
    deleteEmployee
} = require('../controllers/employeeController')
const upload = require('../middlewares/upload')
router.get('/insert',authenticatedUser,isAdmin,getEmployeeRegistrationForm)
router.post('/insert',authenticatedUser,isAdmin,upload.fields([{name:'profilePic',maxCount: 1}]),postEmployeeRegistrationForm)
router.get('/',authenticatedUser,isAdmin,getEmployeeList)
router.get('/delete/:id',authenticatedUser,isAdmin,deleteEmployee)

module.exports= router