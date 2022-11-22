
const {Schema,model}=require('mongoose')

const StockholderSchema=new Schema({
    name:{
        type: String,
        required:true,
    },
    country: String,
    type:{
        type: String,
        enum:['buyer','seller'],
        required:true
    },
    status:{
        type:Boolean,
        default: true
    },
    address: String,
    phone:[String],
    email: String
},{
    timestamps:true
})

module.exports=model('Stockholder',StockholderSchema)