<template>
    <div>
        <!-- Состояние загрузки -->
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Загрузка товара...</p>
        </div>

        <!-- Состояние ошибки -->
        <div v-else-if="error" class="error-state">
            <p>Не удалось загрузить товар</p>
            <button @click="fetchProduct">Попробовать ещё раз</button>
        </div>

        <!-- Успешная загрузка -->
        <div v-else-if="product" class="product-detail">
            <h1 class="product-title">{{ product.title }}</h1>
            <p class="product-category" v-if="product.category">{{ product.category.name }}</p>

            <div class="product-image-container">
                <img
                    :src="mainImage || fallbackImage"
                    :alt="`${product.title} - основное изображение`"
                    class="product-image"
                    @error="handleImageError"
                    loading="lazy"
                />
            </div>

            <div class="product-price">{{ formattedPrice }}</div>

            <div v-if="product.description" class="product-description">{{ product.description }}</div>

            <button
                v-if="!getCartProduct(product.id)"
                class="add-to-cart-btn"
                @click="addToCart"
                :disabled="getCartProduct(product.id)"
            >{{ getCartProduct(product.id) ? 'В корзине' : 'В корзину' }}</button>
            <button
                v-if="getCartProduct(product.id)"
                class="remove-from-cart-btn"
                @click="removeFromCart"
            >Удалить</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/storeCart.js'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { formatPriceToRub } from '@/utils/misc.js'

const store = useCartStore()
const { add, remove, getCartProduct } = store
const route = useRoute()
const mainImage = computed(() => result.value?.product?.thumbnail) || fallbackImage
const fallbackImage = 'https://via.placeholder.com/600x400?text=No+Image'

const GET_PRODUCT = gql`
    query GetProduct($id: ID!) {
        product(id: $id) {
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
            images
        }
    }
`

const { result, loading, error, refetch } = useQuery(GET_PRODUCT, () => ({ id: route.params.id }), {
    fetchPolicy: 'cache-and-network',
})

const product = computed(() => result.value?.product)

const fetchProduct = () => {
    refetch()
}

const formattedPrice = computed(() => {
    return formatPriceToRub(product.value.price?.toFixed(2))
})

const handleImageError = () => {
    mainImage.value = fallbackImage
}

const addToCart = () => {
    add(product.value, 1)
}

const removeFromCart = () => remove(product.value.id)
</script>

<style lang="scss" scoped>
.product-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #42b983;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
}

.error-state {
    text-align: center;
    color: #ff4444;

    button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
}

.product-title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
}

.product-category {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.product-image-container {
    margin: 1.5rem 0;

    .product-image {
        max-width: 400px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.product-price {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 1rem 0;
}

.product-description {
    line-height: 1.6;
    color: #555;
    margin: 1.5rem 0;
}

.add-to-cart-btn {
    padding: 0.75rem 1.5rem;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;

    &:hover:not(:disabled) {
        background: #3aa876;
    }

    &:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }
}
.remove-from-cart-btn {
    padding: 0.75rem 1.5rem;
    background: #c62828;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>