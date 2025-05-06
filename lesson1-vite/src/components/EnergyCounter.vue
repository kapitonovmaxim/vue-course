<template>
  <div class="percentage-circle">
    <svg :width="size" :height="size" viewBox="0 0 36 36" class="circle-chart">
      <path
        class="circle-bg"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="backgroundColor"
        stroke-width="3"
      />

      <path
        class="circle-fill"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="fillColor"
        stroke-width="3"
        :stroke-dasharray="`${percentage} 100`"
        stroke-linecap="round"
      />

      <text x="18" y="20.5" class="percentage-text" text-anchor="middle">
        {{ percentage }}%
      </text>
    </svg>
  </div>
</template>

<script setup>
  const size = 150;
  const backgroundColor = '#e0e0e0';
  const fillColor = '#4CAF50';

  defineProps({
    percentage: Number
  });

</script>

<style scoped lang="scss">
.percentage-circle {
  position: relative;
  margin-bottom: 40px;
}

.circle-chart {
  display: block;
  margin: 0 auto;
}

.circle-fill {
  animation: circle-fill-animation 1.5s ease-in-out;
  transform: rotate(-90deg);
  transform-origin: center;
}

.percentage-text {
  font-size: 0.6em;
  font-weight: bold;
  fill: white;
}

@keyframes circle-fill-animation {
  0% {
    stroke-dasharray: 0 100;
  }
}
</style>