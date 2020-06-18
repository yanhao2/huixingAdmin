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
                    name: 'UserList',
                    redirect: '/UserList',
                    component:  resolve => require(['../views/User/UserList.vue'], resolve),
                },
                {
                    path: '/UserList',
                    name: 'UserList',
                    component:  resolve => require(['../views/User/UserList.vue'], resolve),
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
                    path: '/CourseList',
                    name: 'CourseList',
                    component:  resolve => require(['../views/Courseware/CourseList.vue'], resolve),
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
