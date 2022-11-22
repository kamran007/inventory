const authRoute = require('./authRoute')
const dashRoute = require('./dashboardRoute')

const Flash = require('../utilities/Flash')

const routes=[
    {
        path:'/auth',
        handler: authRoute
    },
    {
        path:'/dashboard',
        handler: dashRoute
    },
    {
        path:'/',
        handler:(req,res)=>{
            res.render('pages/login',{
                title: 'LogIn',
                errors:{},
                flashMessage: Flash.getMessage(req)
            })
        }
    }
]

module.exports = (app) =>{
    routes.forEach((ele)=>{
        app.use(ele.path, ele.handler)
    })
}