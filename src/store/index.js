import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // urlApi: 'http://101.37.76.197:9527/',
        urlApi: 'http://server.cuckoo.city:9527/',
        token: '',
        user: '',
        routerUrl: ''
    },
    getters: {
        getSortageUser: function (state) {
            if (!state.user) {
                state.user = JSON.parse(localStorage.getItem('user'))
            }
            return state.user
        },
        getSortageToken: function (state) {
            if (!state.token) {
                state.token = JSON.parse(localStorage.getItem('token'))
            }
            return state.token
        },
        getSortageRouter: function (state) {
            if (!state.routerUrl) {
                state.routerUrl = JSON.parse(localStorage.getItem('routerUrl'))
            }
            return state.routerUrl
        }
    },
    mutations: {
        setStorageToken(state, value) {
            state.token = value;
            localStorage.setItem('token', JSON.stringify(value))
        },
        setStorageUser(state, value) {
            state.user = value;
            localStorage.setItem('user', JSON.stringify(value))
        },
        setStorageRouter(state, value) {
            state.routerUrl = value;
            localStorage.setItem('routerUrl', JSON.stringify(value))
        },
        removeStorage(state, key) {
            state.token = null;
            localStorage.removeItem(key)
        },
    },
    actions: {},
    modules: {}
})
