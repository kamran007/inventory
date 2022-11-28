
const {Schema,model}=require('mongoose')

const importOrderSchema=new Schema({
    importForm:{
        type:Schema.Types.ObjectId,
        ref: 'Stockholder',
        required:true
    },
    item:[{
        itemName:{
            type:Schema.Types.ObjectId,
            ref: 'Product',
            required:true
        },
        unitPrice:Number,
        quantity:Number,
    }],
    otherCost:[
        {
            costDescription: String,
            amount: Number
        }
    ],
    comment: String
},{
    timestamps:true
})
module.exports=model('ImportOrder',importOrderSchema)