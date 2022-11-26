
const {Schema,model}=require('mongoose')

const saleSchema=new Schema({
    saleTo:{
        type:Schema.Types.ObjectId,
        ref: 'Stockholder',
        required:true
    },
    saleBy:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    item:[{
        itemId:{
            type:Schema.Types.ObjectId,
            ref: 'Product',
            required:true
        },
        price:Number,
        quantity:Number,
        total:Number
    }],
    payable: Number,
    discount:Number,
    paid: Number,
    due:Number,
    date: Date,
    paymentType: String,
    comment: String
},{
    timestamps:true
})
module.exports=model('Sale',saleSchema)