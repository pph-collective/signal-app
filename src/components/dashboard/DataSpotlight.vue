<template>
  <div class="signal-grid-container">
    <div>
      <BarChart
        v-if="props.age.value === 'adjusted'"
        :active-stats="activeStats"
        :metric="props.metric"
        :age="props.age"
        :legend-title="props.legendTitle"
      />
      <GroupBarChart
        v-if="props.age.value === 'specific'"
        :active-stats="specificStats"
        :metric="props.metric"
        :age="props.age"
        :legend-title="props.legendTitle"
      />
    </div>
    <div class="centered">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="has-text-centered"
        style="font-size: 1.2rem"
        v-html="sanitizeHtml(props.text[props.metric.value][props.age.value])"
      />
      <!-- eslint-enable -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import sanitizeHtml from "sanitize-html";

import BarChart from "@/components/dashboard/BarChart.vue";
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";

const props = defineProps<{
  metric: FocusStat;
  age: SpotlightFocus;
  data: SpotlightStats;
  text: SpotlightText;
  legendTitle: string;
}>();

const activeStats = computed(() => {
  const row = props.data.age_adjusted.filter(
    (stat) => stat.outcome_type === props.metric.value,
  );
  return row;
});

const specificStats = computed(() => {
  const row = props.data.age_specific
    .filter((stat) => stat.outcome_type === props.metric.value)
    .map((item) => ({
      ...item,
      label: item.hud_age_group
        .substring(3)
        .replace("_", "-")
        .replace("plus", "+"),
    }));
  return row;
});
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
.spaced {
  margin-bottom: 1.1em;
}
</style>
