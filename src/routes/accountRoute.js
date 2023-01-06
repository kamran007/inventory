const router = require('express').Router()
const {authenticatedUser,isAdmin} = require('../middlewares/authMiddleware')
const {getIndividualAccount,getAllAccounts} = require('../controllers/accountController')

router.get('/',authenticatedUser,getAllAccounts)
router.get('/:id',authenticatedUser,getIndividualAccount)

module.exports= router