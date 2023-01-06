const {Schema,model} = require('mongoose')

const paymentSchema = new Schema({
    paymentType :{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }   
},
{
    timestamps: true
})

module.exports = model('Payment',paymentSchema)