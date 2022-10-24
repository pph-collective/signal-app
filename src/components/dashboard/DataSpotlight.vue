<template>
  <div class="signal-grid-container">
    <div>
      <BarChart
        v-if="props.nameThis.value == 'adjusted'"
        :active-stats="activeStats"
        :metric="props.metric"
      />
      <GroupBarChart
        v-else
        :active-stats="specificStats"
        :metric="props.nameThis"
      />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        Lorem Ipsum
        <strong>{{ props.metric.name.toLowerCase() }}</strong> dolor sit amet,
        consectetur adipiscing elit. Nulla pretium tempor mi eget pellentesque.
        Etiam pharetra neque quis elit aliquam tristique.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import BarChart from "@/components/dashboard/BarChart.vue";
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";

const props = defineProps<{
  metric: FocusStat;
  nameThis: SpotlightFocus;
  data: SpotlightStats;
}>();

const activeStats = computed(() => {
  const row = props.data.age_adjusted.filter(
    (stat) => stat.outcome_type === props.metric.value
  );
  return row;
});

const specificStats = computed(() => {
  const row = props.data.age_specific.filter(
    (stat) => stat.outcome_type === props.metric.value
  );
  return row;
});
console.log(specificStats);
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
