<template>
  <div class="gap-container">
    <div>
      <GapChart
        :stats="stats"
        :active-cluster="activeCluster.name"
        :field-names="['asian', 'black', 'latino', 'white']"
      />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        In this community, the largest gap is among [group]. Only [X%] of
        [group] are vaccinated compared to [X%] statewide. [count] more people
        need to be vaccinated to close this gap.
      </p>
    </div>
  </div>
</template>

<script lant="ts" setup>
import GapChart from "@/components/dashboard/GapChart.vue";

defineProps({
  stats: {
    type: Array,
    required: true,
  },
  activeCluster: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.gap-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
  max-width: 100%;
}

.centered {
  display: grid;
  place-content: center;
}
</style>
