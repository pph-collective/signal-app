<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { useVega } from "../../composables/useVega";
import { computed, ref } from "vue";

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 300,
    height: 240,
    padding: 5,
    data: {
      name: "table",
      values: [
        { category: "Private", value: 0.1 },
        { category: "Subsidized", value: 0.7 },
        { category: "Public", value: 0.6 },
        { category: "Other", value: 0.1 },
      ],
    },
    scales: [
      {
        name: "yscale",
        type: "band",
        domain: { data: "table", field: "category" },
        range: "height",
        padding: 0.2,
      },
      {
        name: "xscale",
        type: "linear",
        domain: [0, 1],
        range: "width",
        round: true,
        zero: true,
        nice: true,
      },
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: "position" },
        range: { scheme: "category20" },
      },
    ],
    axes: [
      {
        orient: "left",
        scale: "yscale",
        tickSize: 0,
        labelPadding: 4,
        zindex: 1,
      },
      { orient: "bottom", scale: "xscale" },
    ],
    marks: [
      {
        type: "group",
        from: {
          facet: {
            data: "table",
            name: "facet",
            groupby: "category",
          },
        },
        encode: {
          enter: {
            y: { scale: "yscale", field: "category" },
          },
        },
        signals: [{ name: "height", update: "bandwidth('yscale')" }],
        scales: [
          {
            name: "pos",
            type: "band",
            range: "height",
            domain: { data: "facet", field: "position" },
          },
        ],
        marks: [
          {
            name: "bars",
            from: { data: "facet" },
            type: "rect",
            encode: {
              enter: {
                y: { scale: "pos", field: "position" },
                height: { scale: "pos", band: 1 },
                x: { scale: "xscale", field: "value" },
                x2: { scale: "xscale", value: 0 },
                fill: { scale: "color", field: "position" },
              },
            },
          },
        ],
      },
    ],
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
