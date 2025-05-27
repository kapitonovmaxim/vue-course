<template>
    <div>
        <div
            v-if="loading_error"
            class="error-message"
        >Произошла ошибка при загрузке данных, используйте VPN :)</div>
        <div v-else>
            <div class="catalog-top">
                <h1>Каталог товаров</h1>
                <div class="catalog-search">
                    <search-input v-model="searchQuery" />
                </div>
                <router-link :to="{ name: 'new-product'}">
                    <button class="add_product">Добавить товар</button>
                </router-link>
            </div>

            <div class="products">
                <product-card
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :product="product"
                    :quantity="getProductQuantity(product.id)"
                    @add-to-cart="addToBasket"
                    @remove-from-cart="removeFromBasket"
                    @decrease-quantity="decreaseQuantity"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

import '@/assets/products.sass'
import ProductCard from '@/components/ProductCard.vue'
import SearchInput from '@/components/SearchInput.vue'

const searchQuery = ref('')
const loading_error = ref(false)
const products = ref([])

const props = defineProps({
    basket: {
        type: Object,
        required: true,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:basket'])

onMounted(async () => {
    try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/products')
        products.value = response.data
    } catch (err) {
        console.error('Ошибка:', err)
        loading_error.value = true
    }
})

const getProductQuantity = (productId) => {
    return props.basket[productId] || 0
}

const addToBasket = (productId) => {
    const newBasket = { ...props.basket }
    newBasket[productId] = (newBasket[productId] || 0) + 1

    emit('update:basket', newBasket)
}

const removeFromBasket = (productId) => {
    const newBasket = { ...props.basket }
    delete newBasket[productId]
    emit('update:basket', newBasket)
}

const decreaseQuantity = (productId) => {
    const newBasket = { ...props.basket }
    if (newBasket[productId] > 1) {
        newBasket[productId] -= 1
    } else {
        delete newBasket[productId]
    }
    emit('update:basket', newBasket)
}

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value

    return products.value.filter(
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