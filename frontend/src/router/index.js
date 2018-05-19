import Vue from 'vue'
import Router from 'vue-router'
import Testament from '@/components/Testament'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Testament',
        component: Testament
    }]
})