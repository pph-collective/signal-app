<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";

interface Props {
  activeStats: SpotlightStat[];
  metric: FocusStat;
}

const props = defineProps<Props>();

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 400,
    padding: 5,
    data: { values: props.activeStats },
    mark: "bar",
    title: `Age-Adjusted Rate of ${props.metric.name} Per 1,000 People`,
    encoding: {
      y: {
        field: "age_adjusted_rate",
        type: "quantitative",
        axis: {
          labelFontSize: 12,
          titleFontSize: 15,
          title: "Rate Per 1,000",
        },
      },
      x: {
        field: "category",
        axis: {
          labelFontSize: 12,
          titleFontSize: 15,
          title: "Housing Type",
          labelAngle: 0,
        },
      },
      color: { value: COLORS.dark },
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
