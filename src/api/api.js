import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router/index'

axios.defaults.baseURL = store.state.urlApi
const token = localStorage.getItem('token')


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
                .catch (error => {
                    // if (error.response.status === 401 || error.response.status === 403) {
                    //     localStorage.removeItem('user')
                    //     localStorage.removeItem('routerUrl')
                    //     localStorage.removeItem('token')
                    //     router.push({path: `/login`});
                    // }
                })
            } catch (error) {

                return reject(error)

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
                console.log(e)
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
    // 课程分类 根据一级获取二级
    ClassificationEr  (data) {
        return this.headersFunToken('GET', `/curriculumClassify/list/secondLevel/${data.firstId}`, data)
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
    // 用户列表  详情
    UserDetails (data) {
        return this.headersFunToken('GET', `/umsUser/${data.id}`, data)
    },
    // 订单记录  详情
    UserDetailsOrderRecord (data) {
        return this.headersFunToken('POST', `/orders/page/user`, data)
    },
    // 课程列表  列表
    CourseList (data) {
        return this.headersFunToken('POST', `/curriculumData/page`, data)
    },
    // 讲师列表  列表
    InstructorList (data) {
        return this.headersFunToken('POST', `/teacher/page`, data)
    },
    // 讲师列表 用户
    InstructorListUser (data) {
        return this.headersFunToken('POST', `/teacher/pageUser`, data)
    },
    // 讲师列表  添加
    InstructorAdd (data) {
        return this.headersFunToken('POST', `/teacher/addTeacher`, data)
    },
    // 平台帖子    列表
    PlatformPostList (data) {
        return this.headersFunToken('POST', `/article/platform/page`, data)
    },
    // 平台帖子 发布
    addPlatformPost (data) {
        return this.headersFunToken('POST', `/article/platform/publish`, data)
    },
    // 平台帖子 发布
    editPlatformPost (data) {
        return this.headersFunToken('POST', `/article/platform/update`, data)
    },
    // 平台帖子 详情
    PlatformPostItemDetails (data) {
        return this.headersFunToken('GET', `/article/platform/${data.id}`, data)
    },
    // 用户帖子 列表
    UserPostList (data) {
        return this.headersFunToken('POST', `/article/user/page`, data)
    },
    // 轮播管理 列表
    BannerList (data) {
        return this.headersFunToken('POST', `/carousel/page`, data)
    },
    // 轮播管理 添加
    AddBannerList  (data) {
        return this.headersFunToken('POST', `/carousel/add`, data)
    },
    // 轮播管理 编辑
    EditBannerList  (data) {
        return this.headersFunToken('POST', `/carousel/update`, data)
    },
    // 轮播管理 详情
    BannerListDetils  (data) {
        return this.headersFunToken('GET', `/carousel/${data.id}`, data)
    },
    // 公告 列表
    NoticeList  (data) {
        return this.headersFunToken('POST', `/bulletin/page`, data)
    },
    // 活动管理 列表
    ActivityList (data) {
        return this.headersFunToken('POST', `/activity/page`, data)
    },
    // 活动管理 添加
    AddActivityList  (data) {
        return this.headersFunToken('POST', `/activity/add`, data)
    },
    // 活动管理 详情
    ActivityListDetils  (data) {
        return this.headersFunToken('GET', `/activity/${data.id}`, data)
    },
    // 活动管理 编辑
    EditActivityList  (data) {
        return this.headersFunToken('POST', `/activity/update`, data)
    }

}
