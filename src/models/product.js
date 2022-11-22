const {Schema,model} = require('mongoose');

const productSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    price:Number,
    stock:Number,
    unit_type: String
},{
    timestamps:true
})

module.exports= model('Product',productSchema)