<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { useVega } from "../../composables/useVega";
import { computed, ref } from "vue";

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
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
      x: { field: "category" },
      y: { field: "value", type: "quantitative" },
      xOffset: { field: "group" },
      color: { field: "group" },
    },
  };
});

const el = ref(null);
useVega({
  spec,
  el,
  minHeight: ref(360),
  maxHeight: ref(360),
  minWidth: ref(360),
  maxWidth: ref(1280),
  includeActions: ref(true),
});
</script>
