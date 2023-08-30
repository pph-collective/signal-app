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
  mapType: string;
}

const props = defineProps<Props>();

// filter the geo to the cluster
const filteredGeo = computed(() => {
  const features = props.geo.filter(
    (g) => props.cluster.cluster_id === g.properties.cluster_id
  );

  return geoToTopo(features, 3e-10);
});

const largeBboxGeojson = computed(() => {
  const { bbox } = filteredGeo.value;
  const scale = 0.1;
  const horizontalMargin = (Math.abs(bbox[0] - bbox[2]) * scale) / 2;
  const verticalMargin = (Math.abs(bbox[1] - bbox[3]) * scale) / 2;

  // [left, bottom, right, top]
  const largeBbox = [
    bbox[0] - horizontalMargin,
    bbox[1] - verticalMargin,
    bbox[2] + horizontalMargin,
    bbox[3] + verticalMargin,
  ];
  const bottomLeft = [largeBbox[0], largeBbox[1]];
  const bottomRight = [largeBbox[2], largeBbox[1]];
  const topLeft = [largeBbox[0], largeBbox[3]];
  const topRight = [largeBbox[2], largeBbox[3]];

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[bottomLeft, topLeft, topRight, bottomRight, bottomLeft]],
    },
  };
});

const filteredLocations = computed(() => {
  const { bbox } = filteredGeo.value;
  // 1deg longitude is 288200 ft (54.6 miles)
  // 1deg latitude is 364000 ft (69 miles)
  const margin = [1 / 54.6, 1 / 69]; // 1 mile

  const locationsBbox = [
    bbox[0] - margin[0],
    bbox[1] - margin[1],
    bbox[2] + margin[0],
    bbox[3] + margin[1],
  ];

  return props.locations.filter((location) => {
    const { longitude, latitude } = location;

    return (
      longitude >= locationsBbox[0] &&
      longitude <= locationsBbox[2] &&
      latitude >= locationsBbox[1] &&
      latitude <= locationsBbox[3]
    );
  });
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
        name: "large_bbox",
        values: largeBboxGeojson.value,
      },
      {
        name: "locations",
        values: filteredLocations.value,
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
        fit: { signal: 'data("large_bbox")' },
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
        name: "location_symbols",
        from: { data: "locations" },
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
