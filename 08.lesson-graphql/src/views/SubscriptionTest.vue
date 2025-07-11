<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { Ref } from 'vue'

interface Product {
    id: string
    title: string
    price: number
    stock: number
}

interface SubscriptionData {
    productUpdated: Product
}

const productData: Ref<Product | null> = ref(null)
const error: Ref<string | null> = ref(null)
const subscriptionEnabled: Ref<boolean> = ref(false)
const subscriptionId: Ref<string> = ref('1')

const PRODUCT_UPDATED_SUBSCRIPTION = gql`
    subscription ProductUpdated($id: ID!) {
        productUpdated(id: $id) {
            id
            title
            price
            stock
        }
    }
`

const { onResult, onError, restart, stop } = useSubscription<SubscriptionData>(PRODUCT_UPDATED_SUBSCRIPTION, () => ({
    id: subscriptionId.value,
}))

const subscribeToProduct = (): void => {
    productData.value = null
    error.value = null

    onResult((result) => {
        if (result.data) {
            productData.value = result.data.productUpdated
            console.log('Получены новые данные:', result.data)
        }
    })

    onError((err) => {
        error.value = `Ошибка подписки: ${err.message}`
        console.error('Subscription error:', err)
    })

    subscriptionEnabled.value = true
    console.log('Подписка активирована')
}

const unsubscribe = (): void => {
    stop()
    subscriptionEnabled.value = false
    console.log('Подписка отменена')
}

const changeProduct = (): void => {
    const newId = prompt('Введите ID товара для подписки:', subscriptionId.value) || '1'
    subscriptionId.value = newId
    if (subscriptionEnabled.value) {
        restart()
    }
}

onUnmounted(unsubscribe)
</script>

<template>
    <div>
        <h2>Тест WebSocket подписки</h2>
        <div>
            <span>Текущий ID товара: {{ subscriptionId }}</span>
            <button @click="changeProduct">Изменить ID</button>
        </div>

        <button @click="subscribeToProduct" :disabled="subscriptionEnabled">Подписаться</button>
        <button @click="unsubscribe" :disabled="!subscriptionEnabled">Отписаться</button>

        <div v-if="productData">
            <h3>Данные товара:</h3>
            <pre>{{ productData }}</pre>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<style scoped>
.error {
    color: red;
    margin-top: 1rem;
}
button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
}
</style>