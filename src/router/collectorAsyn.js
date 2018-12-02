export default [
    {
        path: '/collect',
        name: 'collect',
        component: resolve => require(['@/pages/tabs/store/simCard/collectorAsyn/collector'], resolve),
    },
    {
        path: '/picType',
        name: 'picType',
        component: resolve => require(['@/pages/tabs/store/simCard/collectorAsyn/picType'], resolve),
    },
    {
        path: '/readIdCard',
        name: 'readIdCard',
        component: resolve => require(['@/pages/common/readIdCard'], resolve),
    }
    ,
    {
        path: '/InputOtherCardInfo',
        name: 'InputOtherCardInfo',
        component: resolve => require(['@/pages/tabs/store/simCard/collectorAsyn/InputOtherCardInfo'], resolve),
    }
]

