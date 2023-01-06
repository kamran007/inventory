const Stockholder = require('../models/stockholder')
const Product = require('../models/product')
const ImportOrder = require('../models/importOrder');
const {getStockById} = require('../businessLogics/StockCalculation')
const Flash = require('../utilities/Flash')

module.exports.getAllImportOrder = async (req,res) =>{
    try{
        // let importOrders = await ImportOrder.aggregate().project({
        //     importForm:1,
        //     product:1,
        //     totalPrice:1,
        //     quantity:1,
        //     otherCost:1,
        //     comment:1,
        //     date:1
        // }).addFields({totalCost:{"$sum": "$otherCost.amount"}})
        // .lookup(
        //     {
        //         from: "stockholders",
        //         localField: "importForm",
        //         foreignField:"_id",
        //         as: "import"
        //     }
        // )
        // .lookup(
        //     {
        //         from: "products",
        //         localField: "product",
        //         foreignField:"_id",
        //         as: "item"
        //     }
        // ).sort({'date':-1})

        let importOrders = await ImportOrder.find().populate([{
            path: 'importFrom',
            select: 'name',
            model: 'Stockholder'
        },
        {
            path: 'product',
            select: '_id productName price',
            model: 'Product'
        }
        ]).sort([['date',-1]])
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
    let {c_d,c_a,exporter,date,product,quantity,totalPrice,totalCost}= req.body;
    let day = new Date(date)
    let today = new Date()
    let d= day.getFullYear()+ '-'+ (day.getMonth()+1) +'-'+day.getDate();
    let time= today.getHours()+':'+ today.getMinutes()+':'+ today.getSeconds();
    date = new Date(d+ ' '+ time);

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
        }
        let targetProduct = await getStockById(product)
        let stockValue = targetProduct.stock * targetProduct.costingPrice;
        let costingPrice = ((parseFloat(totalCost)+ parseFloat(stockValue))/(parseFloat(quantity)+parseFloat(targetProduct.stock))).toFixed(3)
        const importOrder = new ImportOrder({ 
            importFrom: exporter,
            product,
            totalPrice,
            quantity,
            otherCost,
            totalCost,
            date
        })
        await importOrder.save();
        await Product.findOneAndUpdate({_id:product},{$set:{costingPrice:costingPrice}})
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