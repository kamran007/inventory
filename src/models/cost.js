const { Schema, model} = require('mongoose')

const costSchema = new Schema({
    costDescription:{
        type: String,
        required:true,
    },
    amount: Number,
    date: Date
},{
    timestamps:true
})

module.exports =model('Cost',costSchema)