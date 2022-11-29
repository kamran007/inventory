const authRoute = require('./authRoute');
const dashRoute = require('./dashboardRoute');
const productRoute = require('./productRoute');
const stockholderRoute = require('./stockholderRoute');
const saleRoute = require('./saleRoute')
const ImportOrderRoute = require('./importOrderRoute')

const Flash = require('../utilities/Flash');

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
        path:'/product',
        handler:productRoute
    },
    {
        path:'/stockholder',
        handler: stockholderRoute
    },
    {
        path: '/sale',
        handler: saleRoute,
    },
    {
        path: '/importOrder',
        handler: ImportOrderRoute
    },
    {
        path:'/',
        handler:(req,res)=>{
            res.render('pages/404',{
            })
        }
    }
]

module.exports = (app) =>{
    routes.forEach((ele)=>{
        app.use(ele.path, ele.handler)
    });
}