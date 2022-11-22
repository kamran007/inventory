
const {Schema,model}=require('mongoose')

const import_orderSchema=new Schema({
    import_form:{
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
        price_per_unit:Number,
        quantity:Number,
    }],
    other_cost:[
        {
            cost_description: String,
            amount: Number
        }
    ],
    comment: String
},{
    timestamps:true
})
module.exports=model('ImportOrder',import_orderSchema)