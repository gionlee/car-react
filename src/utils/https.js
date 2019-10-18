import axios from 'axios';
import qs from 'qs';
axios.defaults.baseURL = 'http://localhost:2020';
axios.defaults.timeout = 100000;
// axios拦截器
axios.interceptors.request.use( req => {
    console.log(req,'1')
    let method = req.method;
    if(method == 'post') {
        req.data = qs.stringify(req.data)
    }
    return req
})
axios.interceptors.response.use(response => {
    // 在这里你可以判断后台返回数据携带的请求码
   if (response.status === 200) {
     return response
   }else {
     // 非200请求报错
     throw Error(response.data.msg || '服务异常')
   }
})
export default axios;