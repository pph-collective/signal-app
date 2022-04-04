<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";
import { geoToTopo } from "../../utils/utils";

interface Props {
  cluster: Cluster;
  geo: Geo[];
  locations: Location[];
}

const props = defineProps<Props>();

// filter the geo to the cluster
const filteredGeo = computed(() => {
  const features = props.geo.filter(
    (g) => props.cluster.cluster_id === g.properties.cluster_id
  );

  return geoToTopo(features, 6e-10);
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: `Map zoomed in to the ${props.cluster.name} cold spot`,
    background: "white",
    autosize: "none",
    signals: [
      {
        name: "tileUrl",
        value:
          "https://api.mapbox.com/styles/v1/ccv-bot/ckr3rr6xu267f19ql084wgkuh/static/",
      },
      {
        name: "mapboxToken",
        value: `?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`,
      },
      { name: "basePoint", update: "invert('projection',[0,0])" },
      { name: "maxPoint", update: "invert('projection', [width, height])" },
      {
        name: "resolution",
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore:next-line
        value: navigator?.connection?.downlink > 1.5 ? "@2x" : "",
      },
    ],
    data: [
      {
        name: "cluster_outline",
        values: filteredGeo.value,
        format: { type: "topojson", feature: "blocks" },
      },
      {
        name: "landmarks",
        values: props.locations,
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
        fit: { signal: 'data("cluster_outline")' },
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
        name: "cluster",
        from: { data: "cluster_outline" },
        encode: {
          enter: {
            stroke: { value: COLORS.dark },
            strokeWidth: { value: 2 },
            strokeOpacity: { value: 0.6 },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
      {
        type: "symbol",
        name: "landmark_symbols",
        from: { data: "landmarks" },
        encode: {
          enter: {
            size: { value: 300 },
            x: { field: "x" },
            y: { field: "y" },
            fill: { value: "red" },
            fillOpacity: { value: 0.5 },
            stroke: { value: "red" },
            strokeWidth: { value: 1.5 },
            cursor: { value: "pointer" },
          },
          update: {
            tooltip: {
              signal: `{'title': datum.name,
               'Address': datum.street_address + ', ' + datum.city + ', ' + datum.state + ' ' + datum.zip_code}`,
            },
          },
        },
      },
    ],
  };
});

// max width and height set due to mapbox static image limits
const el = ref(null);
useVega({
  spec,
  el,
  minHeight: ref(400),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(false),
});
</script>
