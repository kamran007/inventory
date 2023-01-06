const ImportOrder = require('../models/importOrder')
const Sale = require('../models/sale')
const Product = require('../models/product')
const {mergeById} = require('../utilities/mergeArrayOfObject')

const findSaleByProduct =async()=>{
    let sale = await Sale.aggregate([
        {
            $unwind: '$item'
        },
        {
            $group:{
                _id: '$item.itemId',
                saleQuantity:{ $sum: '$item.quantity'}
            }
        }
    ])
    return sale
}

const findImportByProduct =async()=>{
    let buy = await ImportOrder.aggregate([
        {
            $group:{
                _id: '$product',
                importQuantity:{ $sum: '$quantity'}
            }
        }
    ])
    return buy
}

const getStock = async()=>{
    let sale= await findSaleByProduct()
    let buy = await findImportByProduct()
    let products = await Product.find().sort([['createdAt',-1]])
    let s = mergeById(products,buy)
    let summary = mergeById(s,sale)
    let d =[]
    summary.forEach(obj=>{
        let data ={}
        data["_id"]=obj._id
        data["productName"]= obj.productName
        data["unitType"]= obj.unitType
        data["costingPrice"]= obj.costingPrice
        data["adjustStock"] = obj.adjustStock
        data["price"] = obj.price? obj.price : 0
        data["buy"] = obj.importQuantity? obj.importQuantity: 0
        data["sale"] = obj.saleQuantity? obj.saleQuantity: 0
        data["stock"] = data["buy"]- data["sale"] - data["adjustStock"]
        d.push(data)
    });
    return d;
}
const getStockById= async(id)=>{
    let summary = await getStock();
    let data = summary.find(obj => JSON.stringify(obj._id) === JSON.stringify(id))
    return data
}
module.exports={getStock,getStockById}