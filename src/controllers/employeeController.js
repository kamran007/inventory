const Employee = require('../models/employee')
const Flash = require('../utilities/Flash')

module.exports.getEmployeeRegistrationForm = (req,res)=>{
    return res.render('pages/employeeRegistrationForm',{
        title: "Employee Registration",
        errors: {},
        flashMessage: Flash.getMessage(req)
    })
}

module.exports.postEmployeeRegistrationForm = async(req,res)=>{
    let { name,address,status,designation,salary}= req.body
    let { profilePic } = req.files;
    try {
        status = status==='on'? true: false
        profilePic = profilePic? profilePic[0].filename : undefined;
        const employee = new Employee({
            name,
            profilePic,
            status,
            designation,
            salary,
            address
        })
        await employee.save()
        req.flash('success','New Employee added successfully')
        res.redirect('/employee/insert')
    } catch (e) {
        console.log(e);
        req.flash('fail','Server Error')
        res.redirect('/employee/insert')
    }
}

module.exports.getEmployeeList = async (req,res)=>{
    try {
        const employees = await Employee.find()
        return res.render('pages/employee',{
            title: "Employee List",
            employees,
            flashMessage: Flash.getMessage(req)
        })
        
    } catch (e) {
        console.log(e);
    }
}

module.exports.deleteEmployee = async (req,res)=>{
    try {
        let {id} = req.params;
        await Employee.findOneAndDelete({_id:id})
        req.flash('success','Employee deleted successfully')
        res.redirect('/employee')
    } catch (e) {
        req.flash('fail','Server Error')
        res.redirect('/employee')
    }
}