import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/Home.vue'


const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/page1',
        component: () => import('/@/pages/Page1.vue')
    },
    {
        path: '/page2',
        component: () => import('/@/pages/Page2.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})

export default router