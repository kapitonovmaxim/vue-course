
<template>
  <h1>Ваша энергия:</h1>
  <EnergyCounter :percentage="percent" />
  <button v-if="percent < 100" class="btn btn--more-energy" @click="increasePercent">Добавить энергии</button>
  <button v-show="!!percent" class="btn btn--less-energy" @click="decreasePercent">Убрать энергии</button>
</template>

<script setup>
  import EnergyCounter from './components/EnergyCounter.vue'
  import { ref } from 'vue';
  let percent = ref(30);
  let animated = ref(false);

  const increasePercent = () => {
    if (percent.value < 100) {
      percent.value = Math.min(100, percent.value + 10);
    }
  }

  const decreasePercent = () => {
    if (percent.value > 0) {
      percent.value = Math.max(0, percent.value - 10);
    }
  }

</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: 52px;
}
.btn {
  user-select: none;
  display: block;
  margin: 0 auto;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>
