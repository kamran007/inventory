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
            },{
                path: 'product',
                select: 'productName',
                model: 'Product'
            }
        ])
        res.render('pages/importOrder',{
            title: "Import Order List",
            importOrders,
            flashMessage: Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e);
    }

}

module.exports.getImportOrderForm = async(req,res)=>{
    try {
        let exporters = await Stockholder.find({'type':'exporter'}).select('_id name')
        let products = await Product.find().select('_id productName');
        res.render('pages/importOrderInsertForm',{
            title: 'Import Order Insert',
            exporters,
            products,
            flashMessage: Flash.getMessage(req)
        })
    } catch (error) {
        log(error)
    }
}

module.exports.postImportOrderForm = async(req,res) =>{
    const {c_d,c_a,exporter,date,product,quantity,totalPrice}= req.body;
    console.log(exporter);

    try {
        let otherCost=[];
        let d= Object.values(c_d)[0].split(',');
        let a= Object.values(c_a)[0].split(',')
        const len = d.length;
        for(let i=0;i<len;i++){
            let obj={}
            obj['costDescription']= d[i]
            obj['amount']= Number(a[i])
            otherCost.push(obj)
            console.log(obj);
        }
        const importOrder = new ImportOrder({ 
            importForm: exporter,
            product,
            totalPrice,
            quantity,
            otherCost,
            date
        })
        await importOrder.save();
        req.flash('success','New Import Order Added')
        res.redirect('/importOrder/insert')
    } catch (error) {
        console.log(error);
        req.flash('fail','Internal Error')
        res.redirect('/importOrder/insert')
    }
}

module.exports.getUpdateImportOrderForm = (req,res) =>{

}

module.exports.postUpdateImportOrderForm = (req,res) =>{
    
}

module.exports.deleteImportOrder = (req,res) =>{
    
}