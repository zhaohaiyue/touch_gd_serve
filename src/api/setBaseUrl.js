let baseUrl = "";   //这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
    case 'development':
    baseUrl = "http://localhost:8080/"  //这里是本地的请求url
    break;
    case 'gray':
    baseUrl = "http://gray/"  //这里是灰度的请求url
    break;
    case 'zhaohytest':
    baseUrl = "http://zhaohytest/"  //这里是测试环境中的url
    break;
    case 'production':
    baseUrl = "http://112.96.29.180:8080/"   //生产环境url
    break;
}
console.log(process.env.NODE_ENV)
console.log(baseUrl)

export default baseUrl;