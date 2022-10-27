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
    height: 240,
    padding: 5,
    data: { values: props.activeStats },
    mark: "bar",
    encoding: {
      x: {
        field: "age_adjusted_rate",
        type: "quantitative",
        axis: {
          labelFontSize: 12,
          titleFontSize: 15,
          title: props.metric.name + " Per 1,000",
        },
      },
      y: {
        field: "category",
        axis: { labelFontSize: 12, titleFontSize: 15, title: "Housing Type" },
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
