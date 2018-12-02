import Vue from 'vue'
import Router from 'vue-router'


//如果用import引入的话，当项目打包时路由里的所有component都会打包在一个js中，
//造成进入首页时，需要加载的内容过多，时间相对比较长。

//当你用require这种方式引入的时候，会将你的component分别打包成不同的js，
//加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js。

//tabs 相关页面
import  tabs from './tabs'
//宽带开户 相关页面
import  broadband from './broadband'
//集客异步开户相关页面
import  collectorAsyn from './collectorAsyn'
import  joinrequest from './joinrequest'
import  prePayment  from './prePayment'
import  order from './order'
//宽带缴费 相关页面
import  broadbandPay from './broadbandPay'

Vue.use(Router)

export default new Router({
    routes: [
        ...tabs,
        ...broadband,
        ...broadbandPay,
        ...collectorAsyn,
        ...joinrequest,
        ...prePayment,
        ...broadband,
        ...order,
    ]
})