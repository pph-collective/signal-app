<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";

interface Props {
  activeStats: AgeSpecificStat[];
  metric: FocusStat;
}

const props = defineProps<Props>();
console.log(props.activeStats);
const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 240,
    padding: 5,
    data: {
      values: props.activeStats,
    },
    mark: "bar",
    encoding: {
      x: {
        field: "age_specific_rate",
        type: "quantitative",
        title: props.metric.name + " Per 1000",
      },
      y: { field: "hud_age_group", title: "Age Group" },
      yOffset: { field: "final_housing_type" },
      color: { field: "final_housing_type", scale: COLORS },
    },
  };
});

const el = ref(null);
useVega({
  spec,
  el,
  minHeight: ref(250),
  maxHeight: ref(250),
  maxWidth: ref(1280),
  includeActions: ref(false),
});
</script>
