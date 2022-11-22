const {Schema, model} = require('mongoose');

const checkSchema = new Schema({
    buyer:{
        type: Schema.Types.ObjectId,
        ref: 'Stockholder',
        required: true
    },
    invoice:{
        type: Schema.Types.ObjectId,
        ref:'BuyberOrder',
        required:true
    },
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

module.exports= model('Check',checkSchema)