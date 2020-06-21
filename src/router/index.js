import Vue from 'vue'
import VueRouter from 'vue-router'
import user from '../views/User/UserList'
Vue.use(VueRouter)
import ViewUI from 'view-design';
Vue.use(ViewUI);

let router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Layout',
            component:  resolve => require(['../components/Layout.vue'], resolve),
            children: [
                {
                    path: '/',
                    name: 'UserList1',
                    redirect: '/UserList',
                    component:  resolve => require(['../views/User/UserList.vue'], resolve),
                },
                {
                    path: '/UserList',
                    name: 'UserList2',
                    component:  resolve => require(['../views/User/UserList.vue'], resolve),
                },
                {
                    path: '/UserListEdit',
                    name: 'UserListEdit',
                    component:  resolve => require(['../views/User/UserListEdit.vue'], resolve),
                },
                {
                    path: '/UserDetails',
                    name: 'UserDetails',
                    component:  resolve => require(['../views/User/UserDetails.vue'], resolve),
                },

                {
                    path: '/LoginLog',
                    name: 'LoginLog',
                    component:  resolve => require(['../views/User/LoginLog.vue'], resolve),
                },
                {
                    path: '/CoursClassification',
                    name: 'CoursClassification',
                    component:  resolve => require(['../views/Courseware/CoursClassification.vue'], resolve),
                },
                {
                    path: '/CoursClassificationEr',
                    name: 'CoursClassificationEr',
                    component:  resolve => require(['../views/Courseware/CoursClassificationEr.vue'], resolve),
                },
                {
                    path: '/AddCoursClassification',
                    name: 'AddCoursClassification',
                    component:  resolve => require(['../views/Courseware/AddCoursClassification.vue'], resolve),
                },

                {
                    path: '/CourseList',
                    name: 'CourseList',
                    component:  resolve => require(['../views/Courseware/CourseList.vue'], resolve),
                },
                {
                    path: '/AddCoursList',
                    name: 'AddCoursList',
                    component:  resolve => require(['../views/Courseware/AddCoursList.vue'], resolve),
                },
                {
                    path: '/InstructorList',
                    name: 'InstructorList',
                    component:  resolve => require(['../views/Instructor/InstructorList.vue'], resolve),
                },
                {
                    path: '/AddInstructorList',
                    name: 'AddInstructorList',
                    component:  resolve => require(['../views/Instructor/AddInstructorList.vue'], resolve),
                },
                {
                    path: '/PlatformPost',
                    name: 'PlatformPost',
                    component:  resolve => require(['../views/Community/PlatformPost.vue'], resolve),
                },
                {
                    path: '/addPlatformPost',
                    name: 'addPlatformPost',
                    component:  resolve => require(['../views/Community/addPlatformPost.vue'], resolve),
                },
                {
                    path: '/UserPost',
                    name: 'UserPost',
                    component:  resolve => require(['../views/Community/UserPost.vue'], resolve),
                },
                {
                    path: '/BannerList',
                    name: 'BannerList',
                    component:  resolve => require(['../views/Operating/BannerList.vue'], resolve),
                },
                {
                    path: '/AddBannerList',
                    name: 'AddBannerList',
                    component:  resolve => require(['../views/Operating/AddBannerList.vue'], resolve),
                },

                {
                    path: '/NoticeList',
                    name: 'NoticeList',
                    component:  resolve => require(['../views/Operating/NoticeList.vue'], resolve),
                },
                {
                    path: '/ActivityList',
                    name: 'ActivityList',
                    component:  resolve => require(['../views/Operating/ActivityList.vue'], resolve),
                },
                {
                    path: '/AddActivityList',
                    name: 'AddActivityList',
                    component:  resolve => require(['../views/Operating/AddActivityList.vue'], resolve),
                },
                {
                    path: '/InvitationUnaudited',
                    name: 'InvitationUnaudited',
                    component:  resolve => require(['../views/Audit/Invitation/Unaudited.vue'], resolve),
                },
                {
                    path: '/InvitationNotPass',
                    name: 'InvitationNotPass',
                    component:  resolve => require(['../views/Audit/Invitation/NotPass.vue'], resolve),
                },
                {
                    path: '/InvitationOkPass',
                    name: 'InvitationOkPass',
                    component:  resolve => require(['../views/Audit/Invitation/OkPass.vue'], resolve),
                },
                {
                    path: '/RemarkUnaudited',
                    name: 'RemarkUnaudited',
                    component:  resolve => require(['../views/Audit/Remark/Unaudited.vue'], resolve),
                },
                {
                    path: '/RemarkNotPass',
                    name: 'RemarkNotPass',
                    component:  resolve => require(['../views/Audit/Remark/NotPass.vue'], resolve),
                },
                {
                    path: '/ReconciliationList',
                    name: 'ReconciliationList',
                    component:  resolve => require(['../views/Financial/ReconciliationList.vue'], resolve),
                },
                {
                    path: '/ReconciliationDetails',
                    name: 'ReconciliationDetails',
                    component:  resolve => require(['../views/Financial/ReconciliationDetails.vue'], resolve),
                },

            ]
        },
        {
            path: '/login',
            name: 'Login',
            component:  resolve => require(['../components/Login.vue'], resolve),
        },
    ]
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
    ViewUI.LoadingBar.start();//iviewui的加载动画开启
    next();
});
router.afterEach(() => {
    ViewUI.LoadingBar.finish();//iviewui的加载动画关闭
});
export default router
