<template>
    <div>
        <div class="catalog-top">
            <h1>Каталог товаров</h1>

            <div class="catalog-search">
                <search-input v-model="searchQuery" />
            </div>
            <router-link :to="{ name: 'new-product'}" v-if="isAuth">
                <button class="add_product">Добавить товар</button>
            </router-link>
        </div>

        <div v-if="queryLoading">Загрузка товаров...</div>
        <div
            v-if="queryError"
            class="error-message"
        >Произошла ошибка при загрузке данных, попробуй позже</div>
        <div v-else class="products">
            <product-card v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import '@/assets/products.sass'
import ProductCard from '@/components/ProductCard.vue'
import SearchInput from '@/components/SearchInput.vue'

const searchQuery = ref('')

import auth from '@/composables/useAuth.js'
const isAuth = ref(auth.isAuthenticated())

const {
    result: getItems,
    loading: queryLoading,
    error: queryError,
} = useQuery(gql`
    query GetProducts {
        products {
            products {
                id
                title
                description
                price
                discountPercentage
                rating
                stock
                brand
                category
                thumbnail
            }
            total
            skip
            limit
        }
    }
`)

const filteredProducts = computed(() => {
    console.log(getItems)

    if (!searchQuery.value) return getItems.value?.products?.products

    return getItems.value?.products?.products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.price.toString().includes(searchQuery.value.toLowerCase())
    )
})
</script>

<style scoped>
.catalog-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.error-message {
    color: red;
    padding: 15px;
    background-color: #ffeeee;
    border-radius: 5px;
    margin-bottom: 20px;
}

.add_product {
    background-color: #4caf50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add_product:hover {
    background-color: #45a049;
}

@media (max-width: 768px) {
    .catalog-top {
        flex-direction: column;
        align-items: flex-start;
    }

    .catalog-search {
        width: 100%;
    }
}
</style>