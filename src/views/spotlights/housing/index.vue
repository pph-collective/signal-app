<template>
  <a ref="scrollRef" class="scroll-anchor" />
  <Dashboard :dataset-name="datasetName" />
</template>

<script setup lang="ts">
import Dashboard from "@/views/spotlights/housing/dashboard.vue";

const datasetName = "housing_spotlight";
</script>

<style scoped>
.scroll-anchor {
  position: absolute;
  top: -2rem;
}
</style>
