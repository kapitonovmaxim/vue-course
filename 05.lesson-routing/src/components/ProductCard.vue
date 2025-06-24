<template>
    <div class="product">
        <router-link :to="{ name: ROUTE_NAMES.PRODUCT, params: { id: product.id } }" class="product__link">
            <div class="product__title">{{ product.title }}</div>
        </router-link>
        <div class="product__category">{{ product.category?.name }}</div>

        <router-link
            :to="{ name: ROUTE_NAMES.PRODUCT, params: { id: product.id } }"
            class="product__image-link"
        >
            <div class="product__img">
                <img :src="product.images[0]" :alt="product.title" loading="lazy" />
            </div>
        </router-link>

        <div class="product__price">${{ product.price.toFixed(2) }}</div>

        <div v-if="isProductInCart" class="product-quantity-controls">
            <button @click.stop="decreaseQuantity" class="quantity-btn">-</button>
            <span class="quantity-value">{{ quantity }}</span>
            <button @click.stop="addToCart" class="quantity-btn">+</button>
            <button @click.stop="removeFromCart" class="remove-btn">Удалить</button>
        </div>
        <button v-else @click.stop="addToCart" class="add-to-cart">В корзину</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes.js'

const emit = defineEmits(['add-to-cart', 'remove-from-cart', 'update-quantity'])

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
})

const isProductInCart = computed(() => props.quantity > 0)

const addToCart = () => {
    emit('add-to-cart', props.product.id)
}

const removeFromCart = () => {
    emit('remove-from-cart', props.product.id)
}

const decreaseQuantity = () => {
    emit('decrease-quantity', props.product.id)
}
</script>

<style scoped>
.product {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
}

.product__link,
.product__image-link {
    text-decoration: none;
    color: inherit;
}

.product__title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
}

.product__reviews {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.9rem;
    color: #666;
}

.product__reviews svg {
    width: 16px;
    height: 16px;
    fill: #ffc107;
}

.product__img {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product__img img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.product__price {
    font-weight: bold;
    font-size: 1.2rem;
    color: #333;
}

.product__desc {
    font-size: 0.9rem;
    color: #555;
    margin-top: auto;
}

.product-quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantity-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-value {
    min-width: 20px;
    text-align: center;
}

.remove-btn {
    margin-left: 8px;
    padding: 4px 8px;
    background: #ffebee;
    border: 1px solid #ffcdd2;
    border-radius: 4px;
    color: #c62828;
    cursor: pointer;
}

.add-to-cart {
    padding: 8px 16px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add-to-cart:hover {
    background: #388e3c;
}
</style>