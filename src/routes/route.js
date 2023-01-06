const authRoute = require('./authRoute');
const dashRoute = require('./dashboardRoute');
const productRoute = require('./productRoute');
const stockholderRoute = require('./stockholderRoute');
const saleRoute = require('./saleRoute')
const importOrderRoute = require('./importOrderRoute')
const costRouter = require('./costRoute')
const employeeRoute = require('./employeeRoute')
const accountRoute = require('./accountRoute')

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
        path:'/cost',
        handler: costRouter
    },
    {
        path: '/importOrder',
        handler: importOrderRoute
    },
    {
        path: '/employee',
        handler: employeeRoute
    },
    {
        path: '/account',
        handler: accountRoute
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