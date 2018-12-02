export default [
    {
        path: '/orders',
        name: 'orders',
        component: resolve => require(['@/pages/tabs/orders/orders'], resolve),
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: resolve => require(['@/pages/tabs/orders/orderDetail'], resolve),
    }
]