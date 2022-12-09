const Stockholder=require('./../models/stockholder')
const Flash=require('./../utilities/Flash')
const {validationResult}=require('express-validator')
const errorFormatter=require('./../utilities/validationErrorFormatter')

module.exports.getAllStockholder= async(req,res)=>{
    try{
        let stockholders= await Stockholder.find()
        res.render('pages/stockholder.ejs',{
            title: 'Stockholder List',
            stockholders,
            flashMessage:Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e)
    }
}

module.exports.getAllExporter= async (req,res)=>{
    try{
        let stockholders= await Stockholder.find({type:'exporter', status: true})
        res.render('pages/stockholder.ejs',{
            title: 'Exporter List',
            stockholders,
            flashMessage:Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e)
    }
}

module.exports.getAllCustomer= async (req,res)=>{
    try{
        let stockholders= await Stockholder.find({type:'customer',status:true})
        res.render('pages/stockholder.ejs',{
            title: 'Customer List',
            stockholders,
            flashMessage:Flash.getMessage(req)
        })
    }
    catch(e){
        console.log(e)
    }
}

// module.exports.getSingleStockholder=(req,res)=>{
//     res.send('get Single Stockholder')
// }

module.exports.getCustomerInsertForm=(req,res)=>{
    res.render('pages/stockholderInsertForm',{
        title:'customer',
        errors:{},
        flashMessage: Flash.getMessage(req)
    })
}

module.exports.getExporterInsertForm=(req,res)=>{
    res.render('pages/stockholderInsertForm',{
        title:'exporter',
        errors:{},
        flashMessage: Flash.getMessage(req)
    })
}

module.exports.postSingleStockholder=(req,res)=>{

    let {name, country, type, status, address, phone, email} =req.body
    status = status === 'on'? true: false;
    let errors=validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        req.flash('fail','check your form')
        return res.render('pages/stockholderInsertForm',{
            title:type,
            errors:errors.mapped(),
            flashMessage:Flash.getMessage(req)
        })
    }
    try{
        let stockholder=new Stockholder({
            name, country, type, status, address, phone, email
        })
        stockholder.save()
        req.flash('success',`new ${type} created successfully`)
        return res.redirect('/stockholder')
    }
    catch(e){
        console.log(e)
    }
}

module.exports.updateSingleStockholder= async (req,res)=>{
    let {id,name, country, type, status, address, phone, email }=req.body
    //console.log(id,name,bio,address, phone, type,status, payable, paid,due)
    try{
        await Stockholder.findOneAndUpdate(
            {
                _id:id
            },{
                $set:{
                    name,
                    country,
                    type,
                    status: status=='on' ? true: false,
                    address,
                    phone,
                    email
                }
            },{
                new:true
            })
            req.flash('success',`Shockholder ${name} is updated successfully`)
            res.redirect('/stockholder')
    }
    catch(e){
        console.log(e)
    }
}

module.exports.deleteSingleStockholder= async (req,res)=>{
    let {id}=req.params
    try{
        await Stockholder.findOneAndDelete({_id:id})
        req.flash('success','Stockholder deleted successfully')
        res.redirect('/dashboard')
    }
    catch(e){
        console.log(e)
    }
}