import axios from 'axios'
/**
* get方法，对应get请求 
* @param {String} url [请求的url地址] 
* @param {Object} params [请求时携带的参数] 
*/
export  function GET(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export  function POST(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'Post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
/** 
 * put方法，对应put请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function PUT(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'Put',
            url: url,
            data: data,
            responseType: 'json',
            transformRequest: [function (data) {
                // 模拟form表单进行提交
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"//"application/json"
            }
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
/** 
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function DELETE(url, params) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'Delete',
            url: url,
            params: params,
            responseType: 'json',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
