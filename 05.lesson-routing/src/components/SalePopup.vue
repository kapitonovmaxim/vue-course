<template>
    <div>
        <div class="popup-overflow" @click.stop="closePopup"></div>
    </div>
</template>

<script setup>
const closePopup = () => {
    emit('close-popup')
}
</script>

<style lang="scss" scoped>

}
</style>
