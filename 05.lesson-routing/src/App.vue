<template>
    <div class="app-container">
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
            <router-link :to="{ name: 'login' }" class="header-login">Войти</router-link>
        </header>

        <main class="main-content">
            <router-view :basket="basket" @update:basket="updateBasket" />
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainCheckout from '@/components/MainCheckout.vue'

const basket = ref({})

const totalItemsInBasket = computed(() => {
    return Object.values(basket.value).reduce((sum, qty) => sum + qty, 0)
})

const updateBasket = (newBasket) => {
    basket.value = newBasket
}
</script>

<style lang="scss" scoped>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f8f9fa;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #2c3e50;
    font-weight: 600;
    font-size: 1.2rem;

    &:hover {
        color: #42b983;
    }
}

.logo-icon {
    width: 24px;
    height: 24px;
    fill: currentColor;
}

.checkout-link {
    text-decoration: none;
}

.main-content {
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .header {
        padding: 10px;
    }

    .main-content {
        padding: 10px;
    }
}
</style>

<style>
/* Глобальные стили */
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

button {
    background: transparent;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #f0f0f0;
    }
}

a {
    color: #2c3e50;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

input::placeholder {
    color: #999;
    opacity: 1;
}
</style>