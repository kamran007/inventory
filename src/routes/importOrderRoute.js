const {
    getAllImportOrder,
    getImportOrderForm,
    postImportOrderForm,
    getUpdateImportOrderForm,
    postUpdateImportOrderForm,
    deleteImportOrder
} = require('../controllers/importOrderController')

const { authenticatedUser } = require('../middlewares/authMiddleware')

const router = require('express').Router();

router.get('/',authenticatedUser,getAllImportOrder)
router.get('/insert',authenticatedUser,getImportOrderForm)
router.post('/insert',authenticatedUser,postImportOrderForm)
router.get('/update/:id',authenticatedUser, getUpdateImportOrderForm)
router.post('/ipdate',authenticatedUser,postUpdateImportOrderForm)
router.get('/delete/:id',authenticatedUser,deleteImportOrder)

module.exports = router