<template>
    <div class="checkout">
        Корзина <span>{{ countBasket }} шт.</span>
    </div>
</template>

<script setup>
defineProps(['countBasket'])
</script>

<style lang="scss" scoped>
.checkout {
    margin-left: auto;
    font-size: 18px;
    span {
        font-weight: bold;
    }
}
</style>
