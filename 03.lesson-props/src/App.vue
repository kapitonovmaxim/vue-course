<template>
  <div>
    <h1>Каталог товаров</h1>
    <div class="products">
      <product-card v-for="product in products" :key="product.id" :product="product" />
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import products from "./assets/products.json";
import './assets/products.sass'
import ProductCard from './components/ProductCard.vue';


onMounted (() => {
console.log(products);
});
</script>

<style scoped>
@import 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css';

</style>