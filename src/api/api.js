import Vue from 'vue'
import axios from 'axios'
import store from '../store'


axios.defaults.baseURL = store.state.urlApi
const token = JSON.parse(localStorage.getItem('token'))
console.log(token)

export default {
    send(method, uri, data, headers, record, ken) {

        return new Promise((resolve, reject) => {
            try {
                axios({
                    method: method,
                    url: uri,
                    data: data,
                    params: method === 'POST' || method === 'PUT' ? '' : data,
                    headers: headers
                })
                        .then(response => {
                            resolve(response.data)
                        })
            } catch (e) {
                reject(e)
            }
        })
    },

    // 处理headers 头部
    headersFun(method, uri, data, record, ken) {
        let headers = {}
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        return this.send(method, uri, data, headers, record, ken)
    },
    // 处理headers 头部
    headersFunToken(method, uri, data, record, ken) {
        let headers = {}
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        headers['Authentication'] = token
        return this.send(method, uri, data, headers, record, ken)
    },
    // 登录
    TheLogin(data) {
        return this.headersFun('POST', `/login`, data)
    },
    CoursClassificationList (data) {
        return this.headersFunToken('POST', `/curriculumClassify/page/first`, data)
    }
}
