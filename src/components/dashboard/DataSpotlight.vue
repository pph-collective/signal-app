<template>
  <div class="signal-grid-container">
    <div>
      <GroupBarChart />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium
        tempor mi eget pellentesque. Etiam pharetra neque quis elit aliquam
        tristique.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
