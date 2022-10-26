<template>
  <div class="signal-grid-container">
    <div>
      <BarChart
        v-if="props.nameThis.value == 'adjusted'"
        :active-stats="activeStats"
        :metric="props.metric"
      />
      <GroupBarChart
        v-if="props.nameThis.value == 'specific'"
        :active-stats="specificStats"
        :metric="props.metric"
      />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        Lorem Ipsum
        <strong>{{ props.metric.name.toLowerCase() }}</strong> dolor sit amet,
        consectetur adipiscing <strong>{{ props.nameThis.name.toLowerCase() }}</strong> elit. Nulla pretium tempor mi eget pellentesque.
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
  const row = props.data.age_specific
    .filter((stat) => stat.outcome_type === props.metric.value)
    .map((item) => ({
      ...item,
      label: item.hud_age_group
        .substring(3)
        .replace("_", " to ")
        .replace("plus", " and older"),
    }));
  return row;
});
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
