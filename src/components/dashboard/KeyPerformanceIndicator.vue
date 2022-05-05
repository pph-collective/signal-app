<template>
  <div class="kpi-container mx-3 has-text-centered has-text-weight-bold">
    <span class="is-size-1">
      {{ value }}
    </span>
    <p>
      {{ title }}
    </p>
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
  max-width: 15rem;
  display: grid;
  place-content: center;
}
</style>
