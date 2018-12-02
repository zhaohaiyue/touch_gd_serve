export default[
    {
        path: '/',
        name: 'tabs',
        component: resolve => require(['@/pages/tabs/tabs'],resolve),
        redirect: '/store',
        children: [
            {
                path: '/store',
                name: 'store',
                component: resolve => require(['@/pages/tabs/store/store'],resolve),
            },
            {
                path: '/order',
                name: 'order',
                component: resolve => require(['@/pages/tabs/orders/orders'],resolve),
            }, {
                path: '/settings',
                name: 'settings',
                component: resolve => require(['@/pages/tabs/settings/settings'],resolve),
            },
        ]
    }
]