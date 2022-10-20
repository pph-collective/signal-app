<template>
  <div class="signal-grid-container">
    <div>
      <BarChart :active-stats="activeStats" :metric="props.metric.value" />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        Lorem Ipsum <strong>{{ props.metric.name.toLowerCase() }}</strong> dolor
        sit amet, consectetur adipiscing elit. Nulla pretium tempor mi eget
        pellentesque. Etiam pharetra neque quis elit aliquam tristique.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import BarChart from "@/components/dashboard/BarChart.vue";

const props = defineProps<{
  metric: FocusStat;
  stats: SpotlightStat[];
}>();

const activeStats = computed(() => {
  const row = props.stats.filter(
    (stat) => stat.outcome_type === props.metric.value
  );
  return row;
});
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
