<template>
    <div class="checkout">
        Корзина
        <span>{{ count }} шт.</span>
    </div>
</template>

<script setup>
defineProps({
    count: {
        type: Number,
        default: 0,
    },
})
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
