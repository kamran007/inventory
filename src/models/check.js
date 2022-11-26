const {Schema, model} = require('mongoose');

const checkSchema = new Schema({
    invoice:{
        type: Schema.Types.ObjectId,
        ref:'Sale',
        required:true
    },
    checkInfo:{
        type:String,
        required:true
    },
    depositDate:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

module.exports= model('Check',checkSchema)