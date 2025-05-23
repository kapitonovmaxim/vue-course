<template>
    <div class="main">
        <header class="header">
            <div class="logo">Spb Market</div>
            <button @click="show_top_search = !show_top_search">поиск</button>
            <search-input v-show="show_top_search" v-model="searchQuery" @search="handleSearch" />
            <main-checkout :countBasket="getProductCount()" />
            <button v-show="getProductCount() > 0" @click="showPopup = !showPopup">Оформить заказ</button>
        </header>
        <div v-if="loading_error" class="error-message">Произошла ошибка при загрузке данных, используйте VPN :)</div>
        <div v-else>
            <h1>
                Каталог товаров
                <button class="add_product" @click="showPopupCreate = !showPopupCreate">Добавить товар</button>
            </h1>
            <div class="catalog-search">
                <search-input v-model="searchQuery" />
            </div>
            <div class="products">
                <product-card
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :product="product"
                    :in_cart="isProductInBasket(product.id)"
                    @click-card-buy-button="handleCardBuyButton"
                />
            </div>
        </div>

        <sale-popup v-if="showPopup" @close-popup="onClosePopup($event)"></sale-popup>
        <create-new-product
            v-if="showPopupCreate"
            @close-popup="showPopupCreate = !showPopupCreate"
        ></create-new-product>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const products = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products')
        products.value = response.data
    } catch (err) {
        console.error('Ошибка:', err)
        loading_error.value = true
    }
})

import './assets/products.sass'
import ProductCard from './components/ProductCard.vue'
import SearchInput from './components/SearchInput.vue'
import MainCheckout from './components/MainCheckout.vue'
import SalePopup from './components/SalePopup.vue'
import CreateNewProduct from './components/CreateNewProduct.vue'

const searchQuery = ref('')
const productsInBasket = ref([])
const showPopup = ref(false)
const showPopupCreate = ref(false)
const show_top_search = ref(false)
const loading_error = ref(false)

const onClosePopup = (success) => {
    if (success) {
        productsInBasket.value = []
    }
    showPopup.value = false
}
const handleCardBuyButton = (productId) => {
    const index = productsInBasket.value.indexOf(productId)

    if (index === -1) {
        productsInBasket.value.push(productId)
    } else {
        productsInBasket.value.splice(index, 1)
    }
}

const isProductInBasket = (productId) => {
    return productsInBasket.value.includes(productId)
}

const getProductCount = () => {
    return productsInBasket.value.length
}

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value

    return products.value.filter(
        (product) =>
            product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.price.toString().includes(searchQuery.value.toLowerCase())
    )
})

const handleSearch = ({ query, filters }) => {
    filteredProducts.value = products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.price.toString().includes(searchQuery.value.toLowerCase())
    )
}
</script>

<style scoped>
@import 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css';
.main {
    margin: 5px 40px 0;
}
.header {
    display: flex;
    column-gap: 25px;
    align-items: center;
    min-height: 54px;
    border-bottom: 1px solid #000;
    padding-bottom: 10px;
}
.catalog-search {
    margin-bottom: 20px;
}
h1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>

<style>
button {
    background: transparent;
    font-size: 16px;
    border: 1px solid black;
    border-radius: 6px;
    padding: 10px 15px;
    user-select: none;
    cursor: pointer;
}
body,
input::placeholder {
    font-family: 'Arial', sans-serif;
}
</style>
