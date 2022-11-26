const router=require('express').Router()
const {authenticatedUser}=require('./../middlewares/authMiddleware')

const {
    getAllSale,
    getSaleInsertForm,
    postSaleInsertForm,
    getUpdateSaleForm,
    postUpdateForm,
    deleteSale
    
}=require('./../controllers/saleController')

router.get('/',authenticatedUser,getAllSale)
router.get('/insert',authenticatedUser,getSaleInsertForm)
router.post('/insert',authenticatedUser,postSaleInsertForm)
router.post('/update',authenticatedUser,postUpdateForm)
router.get('/update/:id',authenticatedUser,getUpdateSaleForm)
router.get('/delete/:id',authenticatedUser,deleteSale)

module.exports=router