const {Schema,model} = require('mongoose');

const productSchema = new Schema({
    productName:{
        type: String,
        required: true,
    },
    price:Number,
    stock:{
        type: Number,
        default: 0
    },
    unitType: String
},{
    timestamps:true
})

module.exports= model('Product',productSchema)