const router = require('express').Router();
const {
    getAllStockholder,
    getSingleStockholder,
    getAllCustomer,
    getAllExporter,
    getCustomerInsertForm,
    getExporterInsertForm,
    postSingleStockholder,
    updateSingleStockholder,
    deleteSingleStockholder
}=require('./../controllers/stockholderController')
const {authenticatedUser}=require('./../middlewares/authMiddleware')
const stockholderInsertFormValidation=require('./../validators/stockholderValidatior/NewStockholderValidation')

router.get('/',authenticatedUser,getAllStockholder)
router.get('/customer',authenticatedUser,getAllCustomer)
router.get('/exporter',authenticatedUser,getAllExporter)
router.get('/insertCustomer',authenticatedUser,getCustomerInsertForm)
router.get('/insertExporter',authenticatedUser,getExporterInsertForm)
router.post('/insert',authenticatedUser,stockholderInsertFormValidation,postSingleStockholder)
router.post('/update',authenticatedUser,updateSingleStockholder)
router.get('/delete/:id',authenticatedUser,deleteSingleStockholder)
// router.get('/:id',authenticatedUser,getSingleStockholder)

module.exports = router;