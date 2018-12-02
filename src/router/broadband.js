export default [
    {
        path: '/searchResource',
        name: 'searchResource',
        component: resolve => require(['@/pages/tabs/store/broadband/broadEasyAccept/searchResource'], resolve),
    },
    {
        path: '/readIdCard',
        name: 'readIdCard',
        component: resolve => require(['@/pages/common/readIdCard'], resolve),
    }
]