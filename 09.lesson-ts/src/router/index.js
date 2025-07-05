import { createWebHistory, createRouter } from 'vue-router'
import CatalogView from '@/views/CatalogView.vue'
import CardView from '@/views/CardView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import AddProductView from '@/views/AddProductView.vue'
import LoginView from '@/views/LoginView.vue'
import SubscriptionTest from '@/views/SubscriptionTest.vue'

const routes = [
        { path: '/', name: 'home', component: CatalogView },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/checkout', name: 'checkout', component: CheckoutView },
        { path: '/new-product', name: 'new-product', component: AddProductView },
        { path: '/product/:id', name: 'product', component: CardView},
        { path: '/test/:id', name: 'test', component: SubscriptionTest},
    ];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router