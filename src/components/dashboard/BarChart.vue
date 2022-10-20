<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";

interface Props {
  activeStats: SpotlightStat[];
  metric: string;
}

const props = defineProps<Props>();

console.log(props.activeStats[0]);
const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 240,
    padding: 5,
    data: {
      values: [
        {
          category: props.activeStats[0].final_housing_type,
          value: props.activeStats[0].age_adjusted_rate,
        },
        {
          category: props.activeStats[1].final_housing_type,
          value: props.activeStats[1].age_adjusted_rate,
        },
        {
          category: props.activeStats[2].final_housing_type,
          value: props.activeStats[2].age_adjusted_rate,
        },
      ],
    },
    mark: "bar",
    encoding: {
      x: { field: "value", type: "quantitative", title: props.metric }, // TODO make this capitalized
      y: { field: "category", title: "Housing Type" },
    },
  };
});

const el = ref(null);
useVega({
  spec,
  el,
  minHeight: ref(250),
  maxHeight: ref(250),
});
</script>
