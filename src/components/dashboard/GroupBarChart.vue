<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { BARCOLORS } from "../../utils/constants";

interface Props {
  activeStats: AgeSpecificStat[];
  metric: FocusStat;
  legendTitle: string;
}
const props = defineProps<Props>();

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 400,
    height: 240,
    padding: 5,
    title: `Age-Specific Rate of ${props.metric.name} Per 1,000 People`,
    data: {
      values: props.activeStats,
    },
    mark: "bar",
    encoding: {
      y: {
        field: "age_specific_rate",
        type: "quantitative",
        axis: {
          labelFontSize: 12,
          titleFontSize: 15,
          title: "Rate Per 1,000",
        },
      },
      x: {
        field: "label",
        title: "Age",
        sort: { field: "age_lower_bound" },
        axis: { labelAngle: 0, labelFontSize: 12, titleFontSize: 15 },
      },
      xOffset: { field: "category" },
      color: {
        field: "category",
        scale: { range: Object.values(BARCOLORS) },
        legend: { title: props.legendTitle },
      },
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
