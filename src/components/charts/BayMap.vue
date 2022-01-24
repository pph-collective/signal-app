<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useVega } from "../../composables/useVega";

import { default as coastlines } from "../../assets/geojson/ri_coast.json";
import { default as ripoly } from "../../assets/geojson/ri.json";

const props = defineProps({
  legend: {
    type: Boolean,
    default: true,
  },
  height: {
    type: Number,
    default: 720,
  },
  background: {
    type: String,
    default: "transparent",
  },
  colorDomain: {
    type: Array,
    required: true,
  },
  colorRange: {
    type: Array,
    required: true,
  },
  dataset: {
    type: Array,
    required: true,
  },
});

const legendSpec = computed(() =>
  props.legend
    ? [
        {
          title: "Buoys",
          orient: "bottom-left",
          type: "symbol",
          symbolType: "circle",
          fill: "color",
          columns: 2,
        },
      ]
    : []
);

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    background: props.background,
    height: props.height,
    data: [
      {
        name: "outlines",
        values: coastlines,
      },
      {
        name: "ri",
        values: ripoly,
        format: { type: "topojson", mesh: "ri" },
      },
      {
        name: "points",
        values: props.dataset,
        format: { type: "json", parse: "auto" },
        transform: [
          {
            type: "geopoint",
            projection: "projection",
            fields: ["longitude", "latitude"],
          },
        ],
      },
    ],
    projections: [
      {
        name: "projection",
        type: "mercator",
        size: { signal: "[width, height]" },
        fit: { signal: '[data("ri"), data("outlines")]' },
      },
    ],
    scales: [
      {
        name: "color",
        type: "ordinal",
        range: props.colorRange,
        domain: props.colorDomain,
      },
    ],
    legends: legendSpec.value,
    marks: [
      {
        type: "shape",
        from: { data: "outlines" },
        encode: {
          enter: {
            strokeWidth: { value: 1 },
            stroke: { value: "#d3d3d3" },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
      {
        type: "shape",
        from: { data: "ri" },
        encode: {
          enter: {
            strokeWidth: { value: 1 },
            stroke: { value: "#d3d3d3" },
            fill: { value: "whitesmoke" },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
      {
        type: "symbol",
        from: { data: "points" },
        encode: {
          enter: {
            size: { value: 100 },
            stroke: { scale: "color", field: "station_name" },
            fill: { scale: "color", field: "station_name" },
            tooltip: {
              signal:
                '{"Buoy ID": datum.buoyId, "Station Name": datum.station_name, "Latitude": format(datum.latitude, ".4f"), "Longitude": format(datum.longitude, ".4f")}',
            },
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
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
