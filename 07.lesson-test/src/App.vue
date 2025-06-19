<template>
    <div class="app-container">
        <main-header/>
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue'
import MainHeader from './components/MainHeader.vue'
const basket = ref({})
import auth from '@/composables/useAuth.js'

const isAuth = ref(auth.isAuthenticated())
const updateAuth = (value) => {
    isAuth.value = value
}
const authUser = (bool = true) => {
    updateAuth(true)
    auth.set(true)
}
provide('isAuth', isAuth)
provide('authUser', authUser)

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