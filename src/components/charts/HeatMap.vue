<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useVega } from "../../composables/useVega";

const props = defineProps({
  variable: {
    type: String,
    required: true,
  },
  x: {
    type: String,
    required: true,
  },
  xTitle: {
    type: String,
    required: false,
    default: "Month/Year",
  },
  xUnit: {
    type: String,
    required: false,
    default: "month",
  },
  y: {
    type: String,
    required: true,
  },
  yTitle: {
    type: String,
    required: false,
    default: "Buoy",
  },
  height: {
    type: Number,
    required: false,
    default: 300,
  },
  dataset: {
    type: Array,
    required: true,
  },
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    height: props.height,
    data: [
      {
        name: "rawData",
        values: props.dataset,
        transform: [
          {
            type: "formula",
            as: "upperX",
            expr: `utcOffset("${props.xUnit}", datum.${props.x})`,
          },
        ],
      },
      {
        name: "data",
        source: "rawData",
        transform: [{ type: "filter", expr: `datum.${props.variable} > 1` }],
      },
    ],
    scales: [
      {
        name: "x",
        type: "utc",
        domain: {
          fields: [
            { data: "rawData", field: props.x },
            { data: "rawData", field: "upperX" },
          ],
        },
        range: "width",
        nice: "month",
      },
      {
        name: "y",
        type: "band",
        domain: { data: "data", field: props.y },
        range: "height",
        padding: 0.02,
      },
      {
        name: "color",
        type: "linear",
        range: { scheme: "tealblues" },
        domain: { data: "rawData", field: props.variable },
        reverse: false,
        zero: false,
        nice: true,
      },
    ],
    axes: [
      {
        orient: "bottom",
        scale: "x",
        domain: false,
        title: props.xTitle,
        labelOverlap: "parity",
      },
      {
        orient: "left",
        scale: "y",
        domain: false,
        title: props.yTitle,
      },
    ],
    legends: [
      {
        title: ["Number of", "Observations"],
        fill: "color",
        type: "gradient",
        gradientLength: { signal: "height" },
      },
    ],
    marks: [
      {
        type: "rect",
        from: { data: "data" },
        encode: {
          enter: {
            x: { scale: "x", field: props.x },
            y: { scale: "y", field: props.y },
            height: { scale: "y", band: 1 },
            width: {
              signal: `scale('x', timeOffset('${props.xUnit}', now())) - scale('x', now())`,
            },
            tooltip: {
              signal: `{'Date': utcFormat(datum.${props.x}, '%B %Y'), '${props.yTitle}': datum.${props.y}, 'Count': datum.${props.variable}}`,
            },
          },
          update: {
            fill: { scale: "color", field: props.variable },
          },
        },
      },
    ],
  };
});

const el = ref<HTMLDivElement>(null);
useVega({
  spec,
  el,
  maxWidth: ref(1280),
  includeActions: ref(false),
});
</script>
