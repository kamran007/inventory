
const {Schema,model}=require('mongoose')

const importOrderSchema=new Schema({
    importFrom:{
        type:Schema.Types.ObjectId,
        ref: 'Stockholder',
        required:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    totalPrice:Number,
    quantity:Number,
    otherCost:[
        {
            costDescription: String,
            amount: Number
        }
    ],
    totalCost: Number,
    comment: String,
    date: Date
},{
    timestamps:true
})
module.exports=model('ImportOrder',importOrderSchema)