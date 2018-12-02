export default [
    {
        path: '/broadbandPay',
        name: 'broadbandPay',
        component: resolve => require(['@/pages/tabs/store/broadband/broadbandPay/broadbandPay'], resolve),
    },
    {
        path: '/broadbandPayDetail',
        name: 'broadbandPayDetail',
        component: resolve => require(['@/pages/tabs/store/broadband/broadbandPay/broadbandPayDetail'], resolve),
    }
]