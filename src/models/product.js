const {Schema,model} = require('mongoose');

const productSchema = new Schema({
    productName:{
        type: String,
        required: true,
    },
    price:Number,
    costingPrice:{
        type: Number,
        default: 0
    },
    adjustStock:{
        type: Number,
        default: 0
    },
    unitType: String
},{
    timestamps:true
})

module.exports= model('Product',productSchema)