import axios from 'axios';
import qs from 'qs';
import cookie from 'react-cookies';
// axios.defaults.baseURL = '';
axios.defaults.baseURL = 'http://www.gionlee.com:2020/api/';

axios.defaults.timeout = 100000;
axios.defaults.withCredentials = true; // 允许写入cookies 、 session 等
// axios拦截器
axios.interceptors.request.use( req => {
    let method = req.method;    
    if (cookie.load('token')) {
      req.headers.Authorization = cookie.load('token');
    }
    
    if(method == 'post') {
        req.data = qs.stringify(req.data)
    }
    return req
})
axios.interceptors.response.use(response => {
  console.log(window.location)
    // 在这里你可以判断后台返回数据携带的请求码
   if (response.status === 200) {
     if (response.data.token) {
      cookie.save('token', response.data.token, { path: '/' })
     }
     if (response.data.code == -1) {
       
       window.location.href = window.location.origin + window.location.pathname + '#/login';
     }
     
     return response
   }else {
     // 非200请求报错
     throw Error(response.data.msg || '服务异常')
   }
})
export default axios;