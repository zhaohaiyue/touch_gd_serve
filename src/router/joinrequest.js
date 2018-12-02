export default [
// 工号融合route
    {
        path: '/joinRequest',
        name: 'joinRequest',
        component: resolve => require(['@/pages/tabs/settings/JoinRequest'], resolve),
    },
    {
        path: '/registerPage',
        name: 'registerPage',
        component: resolve => require(['@/pages/tabs/settings/RegisterPage'], resolve),
    },
    {
        path: '/registerPage1',
        name: 'registerPage1',
        component: resolve => require(['@/pages/tabs/settings/RegisterPage1'], resolve),
    },
    {
        path: '/registerPage2',
        name: 'registerPage2',
        component: resolve => require(['@/pages/tabs/settings/RegisterPage2'], resolve),
    }
]