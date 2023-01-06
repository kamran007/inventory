const router=require('express').Router()
const {
    getProductInsertForm,
    postProductInsertForm,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getSetPriceForm,
    postsetPriceForm
}=require('./../controllers/productController')

const productInsertValidator = require('./../validators/productValidations/productInsertValidator');

const {authenticatedUser}=require('./../middlewares/authMiddleware')


router.get('/insert',authenticatedUser ,getProductInsertForm)
router.post('/insert', authenticatedUser,productInsertValidator,postProductInsertForm)
router.post('/update',authenticatedUser,updateProduct)
router.get('/delete/:id',authenticatedUser,deleteProduct)
router.get('/setPrice',authenticatedUser,getSetPriceForm)
router.post('/setPrice',authenticatedUser,postsetPriceForm)
router.get('/',authenticatedUser,getAllProduct)
module.exports=router