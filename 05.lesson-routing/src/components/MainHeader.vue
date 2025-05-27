<template>
    <header class="header">
        <router-link to="/" class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="logo-icon">
                <path
                    d="M36.8 192l566.3 0c20.3 0 36.8-16.5 36.8-36.8c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0L121.7 0c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM64 224l0 160 0 80c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-80 0-160-64 0 0 160-192 0 0-160-64 0zm448 0l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32l0-256-64 0z"
                />
            </svg>
            <span class="logo-text">Market</span>
        </router-link>

        <router-link to="/checkout" class="checkout-link">
            <main-checkout :count="totalItemsInBasket" />
        </router-link>
        <router-link :to="{ name: 'login' }" class="header-login" v-if="!authStatus">Войти</router-link>
    </header>
</template>

<script setup>
import { computed, onMounted, ref, watch, inject } from 'vue'
import MainCheckout from '@/components/MainCheckout.vue'
// import auth from '@/composables/useAuth.js'

const authStatus = inject('isAuth')

const props = defineProps({
    basket: {
        type: Object,
        required: true,
    },
})

onMounted(() => {
    console.log(authStatus.value)
})

const totalItemsInBasket = computed(() => {
    return Object.values(props.basket).reduce((sum, qty) => sum + qty, 0)
})
</script>

<style lang="scss" scoped>
</style>