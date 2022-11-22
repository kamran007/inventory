
const {Schema,model}=require('mongoose')

const buyer_orderSchema=new Schema({
    sale_to:{
        type:Schema.Types.ObjectId,
        ref: 'Stockholder',
        required:true
    },
    sale_by:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    item:[{
        itemName:{
            type:Schema.Types.ObjectId,
            ref: 'Product',
            required:true
        },
        price_per_unit:Number,
        quantity:Number,
    }],
    payable: Number,
    discount:Number,
    paid: Number,
    due:Number,
    payment_type: String,
    payment_ref:{
        type: Schema.Types.ObjectId,
        ref:'Check'
    },
    comment: String
},{
    timestamps:true
})
module.exports=model('BuyerOrder',buyer_orderSchema)