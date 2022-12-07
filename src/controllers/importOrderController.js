const Stockholder = require('../models/stockholder')
const Product = require('../models/product')
const ImportOrder = require('../models/importOrder');
const Flash = require('../utilities/Flash')

module.exports.getAllImportOrder = async (req,res) =>{
    try{
        let importOrders = await ImportOrder.find().populate([
            {
                path: 'importForm',
                select: 'name',
                model: Stockholder
            }
        ])
        res.render('pages/importOrder',{
            title: "Import Order List",
            importOrders,
            flashMesaage: Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e);
    }

}

module.exports.getImportOrderForm = async(req,res)=>{
    try {
        let exporters = await Stockholder.find({'type':'exporter'}).select('_id name')
        let products = await Product.find().select('_id productName')
        res.render('pages/importOrderInsertForm',{
            title: 'Import Order Insert',
            exporters,
            products,
            flashMesaage:Flash.getMessage(req)
        })
    } catch (error) {
        log(error)
    }
}

module.exports.postImportOrderForm = (req,res) =>{

}

module.exports.getUpdateImportOrderForm = (req,res) =>{

}

module.exports.postUpdateImportOrderForm = (req,res) =>{
    
}

module.exports.deleteImportOrder = (req,res) =>{
    
}