<template>
    <h1>{{ product?.title }}</h1>
    <div>{{ product?.category?.name }}</div>

    <img :src="product?.images[0]" alt="изображение {{ product.title }}" />

    <div>${{ product?.price }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)
const loading_error = ref(null)

onMounted(async () => {
    try {
        const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${route.params.id}`)
        product.value = response.data
    } catch (err) {
        console.error('Ошибка:', err)
        loading_error.value = true
    }
})
</script>

<style lang="scss" scoped>
</style>