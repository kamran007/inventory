const {Schema,model} = require('mongoose')

const employeeSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    profilePic:{
        type: String,
        default: 'profile.jpg'
    },
    email: String,
    address: String,
    status: Boolean,
    designation: String,
    salary: Number
},{
    timestamps: true
})

module.exports = model('Employee',employeeSchema)