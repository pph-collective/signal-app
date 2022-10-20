<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
// import { COLORS } from "../../utils/constants";

// interface Props {
//   activeStats: AgeSpecificStat[];
// }

// const props = defineProps<Props>();

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 240,
    padding: 5,
    data: {
      values: [
        { category: "A", group: "x", value: 0.1 },
        { category: "A", group: "y", value: 0.6 },
        { category: "A", group: "z", value: 0.9 },
        { category: "B", group: "x", value: 0.7 },
        { category: "B", group: "y", value: 0.2 },
        { category: "B", group: "z", value: 1.1 },
        { category: "C", group: "x", value: 0.6 },
        { category: "C", group: "y", value: 0.1 },
        { category: "C", group: "z", value: 0.2 },
      ],
    },
    mark: "bar",
    encoding: {
      x: { field: "value", type: "quantitative" },
      y: { field: "category" },
      yOffset: { field: "group" },
      color: { field: "group" },
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
  includeActions: ref(true),
});
</script>
