
const Flash=require('./../utilities/Flash')
module.exports.getDashboard=(req,res)=>{
    res.render('pages/dashboard.ejs',{
        title: 'Dashboard',
        errors:{},
        flashMessage:Flash.getMessage(req)
    })
}