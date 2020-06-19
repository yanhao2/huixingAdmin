import Vue from 'vue'
import axios from 'axios'
import store from '../store'


axios.defaults.baseURL = store.state.urlApi
const token = localStorage.getItem('token')
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
                localStorage.removeItem('user')
                localStorage.removeItem('routerUrl')
                localStorage.removeItem('token')
                this.$router.push({path: `/login`});
            }
        })
    },
    sendAdd(method, uri, data, headers, record, ken) {
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
                            resolve(response)
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
        headers['Authentication'] = token.replace(/\"/g, "");
        return this.send(method, uri, data, headers, record, ken)
    },
    // 处理headers 头部
    headersFunTokenAdd(method, uri, data, record, ken) {
        let headers = {}
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        headers['Authentication'] = token.replace(/\"/g, "");
        return this.sendAdd(method, uri, data, headers, record, ken)
    },
    // 登录
    TheLogin(data) {
        return this.headersFun('POST', `/login`, data)
    },
    // 课程分类 列表
    CoursClassificationList (data) {
        return this.headersFunToken('POST', `/curriculumClassify/page/first`, data)
    },
    // 课程分类 添加上下级分类
    ClassificationParentId  (data) {
        return this.headersFunToken('GET', `/curriculumClassify/list/firstLevel`, data)
    },
    // 获取私有七牛云 token
    updateToken  (data) {
        return this.headersFunToken('GET', `/file/update/token`, data)
    },
    // 获取私有七牛云 token
    updateUrl  (data) {
        return this.headersFunToken('GET', `/file/url`, data)
    },
    // 课程分类 添加 提交
    ClassificationAdd  (data) {
        return this.headersFunToken('POST', `/curriculumClassify/add`, data)
    },
    // 课程分类 二级分类 列表
    CoursClassificationErList  (data) {
        return this.headersFunToken('POST', `/curriculumClassify/page/second`, data)
    },
    // 用户列表  列表
    UserList (data) {
        return this.headersFunToken('POST', `/umsUser/page`, data)
    },
    // 用户列表  类型
    UserListType (data) {
        return this.headersFunToken('GET', `/umsUser/type`, data)
    },
    // 用户列表  编辑
    UserListEdit (data) {
        return this.headersFunToken('POST', `/umsUser/update`, data)
    },

}
