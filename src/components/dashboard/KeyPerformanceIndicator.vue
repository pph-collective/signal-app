<template>
  <div class="kpi-container">
    <div class="centered">
      <span class="has-text-weight-bold is-size-1 has-text-centered">
        {{ value }}
      </span>
      <p class="has-text-centered has-text-weight-bold">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  value: number | string;
}>();
</script>

<style scoped>
.kpi-container {
  gap: 1.5rem;
}

.centered {
  display: grid;
  place-content: center;
}
</style>
