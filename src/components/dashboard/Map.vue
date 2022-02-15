<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";

import * as topology from "topojson-server";
import * as tc from "topojson-client";
import * as ts from "topojson-simplify";
const topojson = { ...ts, ...tc };

const props = defineProps({
  geo: {
    type: Array,
    required: true,
  },
  stats: {
    type: Array,
    required: true,
  },
});

const el = ref(null);

const filteredGeo = computed(() => {
  const collection = {
    blocks: { type: "FeatureCollection", features: props.geo },
  };

  let topo = topology.topology(collection, 1e5);

  // simplify/smooth out the geometry a bit
  const sphericalArea = 1e-9;
  topo = topojson.presimplify(topo, topojson.sphericalTriangleArea);
  topo = topojson.simplify(topo, sphericalArea);
  topo = topojson.filter(
    topo,
    topojson.filterAttachedWeight(
      topo,
      sphericalArea,
      topojson.sphericalRingArea
    )
  );

  return topo;
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    background: "transparent",
    signals: [
      {
        name: "tileUrl",
        value:
          "https://api.mapbox.com/styles/v1/ccv-bot/ckr3rr6xu267f19ql084wgkuh/static/",
      },
      {
        name: "mapboxToken",
        value:
          "?access_token=pk.eyJ1IjoiY2N2LWJvdCIsImEiOiJja3ZsY2JzMHY2ZGRiMm9xMTQ0eW1nZTJsIn0.uydOaXlX1uQfxPrKfucB2A",
      },
      { name: "basePoint", update: "invert('projection',[0,0])" },
      { name: "maxPoint", update: "invert('projection', [width, height])" },
      {
        name: "resolution",
        // value: navigator?.connection?.downlink > 1.5 ? "@2x" : "",
        value: "",
      },
    ],
    data: [
      {
        name: "cluster_outlines",
        values: filteredGeo.value,
        format: { type: "topojson", feature: "blocks" },
      },
    ],
    projections: [
      {
        name: "projection",
        type: "mercator",
        size: { signal: "[width, height]" },
        fit: { signal: 'data("cluster_outlines")' },
      },
    ],
    marks: [
      {
        type: "image",
        clip: true,
        encode: {
          update: {
            url: {
              signal:
                "tileUrl + '[' + basePoint[0] + ',' +   maxPoint[1] + ',' + maxPoint[0] + ',' + basePoint[1] + ']/' + width + 'x' + height + resolution + mapboxToken",
            },
            width: { signal: "width" },
            height: { signal: "height" },
          },
        },
      },
      {
        type: "shape",
        name: "block_groups",
        from: { data: "cluster_outlines" },
        encode: {
          enter: {
            cursor: { value: "pointer" },
            strokeWidth: { value: 1 },
          },
          update: {
            // stroke: [
            //   { test: "datum === activeGeography", value: "#990000" },
            //   { value: "#999999" },
            // ],
            // fillOpacity: [
            //   { test: "datum === activeGeography", value: 0.5 },
            //   { value: 0.2 },
            // ],
            // zindex: [
            //   { test: "datum === activeGeography", value: 1 },
            //   { value: 0 },
            // ],
            // tooltip: {
            //   signal: tooltipSignal.value,
            // },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
      // {
      //   type: "shape",
      //   from: { data: "cluster_outlines" },
      //   encode: {
      //     enter: {
      //       strokeWidth: { value: 2 },
      //       stroke: { value: "#393939" },
      //       fillOpacity: { value: 0 },
      //     },
      //   },
      //   transform: [{ type: "geoshape", projection: "projection" }],
      // },
    ],
  };
});

useVega({
  spec,
  el,
  minHeight: ref(400),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(true),
});
</script>
