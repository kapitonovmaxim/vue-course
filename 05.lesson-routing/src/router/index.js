import { createWebHistory, createRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes.js'

const routes = [
        {
            path: '/',
            name: ROUTE_NAMES.HOME,
            component: () => import('@/views/CatalogView.vue')
        },
        {
            path: '/login',
            name: ROUTE_NAMES.LOGIN,
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/checkout',
            name: ROUTE_NAMES.CHECKOUT,
            component: () => import('@/views/CheckoutView.vue')
        },
        {
            path: '/new-product',
            name: ROUTE_NAMES.NEW_PRODUCT,
            component: () => import('@/views/AddProductView.vue')
        },
        {
            path: '/product/:id',
            name: ROUTE_NAMES.PRODUCT,
            component: () => import('@/views/CardView.vue')
        },
    ];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router