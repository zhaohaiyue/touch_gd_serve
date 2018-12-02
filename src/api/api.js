import axios from 'axios'
import baseUrl from './setBaseUrl'
import urlConfig from './urlConfig'

axios.defaults.withCredentials = true;
//设置请求的基准路径
axios.defaults.baseURL = baseUrl

//标准地址局向查询接口
export const getOssAddQuery = (params) => {
    return axios.get(urlConfig.broadband.broadEasyAccept.ossAddQuery, {
        params: params
    }).then(function (res) {
        return res
    })
}
//固网资源预判接口
export const getOssResouceQuery = (params) => {
    return axios.get(urlConfig.broadband.broadEasyAccept.ossResouceQuery, {
        params: params
    }).then(function (res) {
        return res
    })
}