<template>
  <div class="signal-grid-container">
    <div>
      <BarChart
        v-if="props.age.value === 'adjusted'"
        :active-stats="activeStats"
        :metric="props.metric"
        :age="props.age"
      />
      <GroupBarChart
        v-if="props.age.value === 'specific'"
        :active-stats="specificStats"
        :metric="props.metric"
        :age="props.age"
      />
    </div>
    <div class="centered">
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-html="marked(props.text[props.metric.value][props.age.value].p1)"
      />
      <!-- eslint-enable -->
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-html="props.text[props.metric.value][props.age.value].p1.innerHTML"
    />
    <!-- eslint-enable -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { marked } from "../../../node_modules/marked";

import BarChart from "@/components/dashboard/BarChart.vue";
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";

const props = defineProps<{
  metric: FocusStat;
  age: SpotlightFocus;
  data: SpotlightStats;
  text: SpotlightText;
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
        .replace("_", "-")
        .replace("plus", "+"),
    }));
  return row;
});

const el = document.createElement("html");
el.innerHTML =
  "<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>";
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
