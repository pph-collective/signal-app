<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVega } from "../../composables/useVega";

import RI_GEOJSON from "@/assets/geography/ri.json";
import NEIGHBORS from "@/assets/geography/neighbors.json";
import { COLORS, NULL_CLUSTER } from "../../utils/constants";

import { cloneDeep } from "lodash/lang";

import { geoToTopo } from "../../utils/utils";

const props = defineProps({
  geo: {
    type: Array,
    required: true,
  },
  stats: {
    type: Object,
    required: true,
  },
  filterTown: {
    type: String,
    required: true,
  },
});

const filteredTown = computed(() => {
  let filtered = cloneDeep(RI_GEOJSON);

  if (props.filterTown !== "All of Rhode Island") {
    filtered = filtered.filter(
      (g) =>
        props.filterTown === g.properties.name ||
        NEIGHBORS[props.filterTown].includes(g.properties.name)
    );
  }

  return filtered;
});

const filteredGeo = computed(() => {
  let filtered = cloneDeep(props.geo);

  filtered.forEach((g: { properties: { vax_first_: number } }) => {
    const datum: object =
      props.stats.find(
        (d: { cluster_number: number }) =>
          d.cluster_number === g.properties.vax_first_
      ) ?? {};

    g.properties = {
      ...g.properties,
      ...datum,
    };
  });

  return geoToTopo(filtered);
});

const tooltipSignal = `{
  title: datum.properties.name,
  'Observed Count': datum.properties.observed_count,
  'Expected Count': datum.properties.expected_count,
}`;

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Map of COVID-19 vaccination cold spots in Rhode Island",
    background: "transparent",
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
      {
        name: "activeGeography",
        value: null,
        on: [
          {
            events: "@cluster_groups:mousedown",
            update: "activeGeography === datum ? null : datum",
          },
          {
            events: "@cluster_groups:touchstart",
            update: "activeGeography === datum ? null : datum",
          },
        ],
      },
    ],
    data: [
      {
        name: "cluster_outlines",
        values: filteredGeo.value,
        format: { type: "topojson", feature: "blocks" },
      },
      {
        name: "town_outlines",
        values: filteredTown.value,
      },
    ],
    projections: [
      {
        name: "projection",
        type: "mercator",
        size: { signal: "[width, height]" },
        fit: { signal: 'data("town_outlines")' },
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
        name: "town_groups",
        from: { data: "town_outlines" },
        encode: {
          enter: {
            strokeWidth: { value: 1 },
            stroke: { value: COLORS.info },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
      {
        type: "shape",
        name: "cluster_groups",
        from: { data: "cluster_outlines" },
        encode: {
          enter: {
            cursor: { value: "pointer" },
            strokeWidth: { value: 1.7 },
          },
          update: {
            stroke: [
              { test: "datum === activeGeography", value: COLORS.green },
              { value: "#999999" },
            ],
            fillOpacity: [
              { test: "datum === activeGeography", value: 0.6 },
              { value: 0.3 },
            ],
            fill: [
              { test: "datum === activeGeography", value: COLORS.link },
              { value: COLORS.green },
            ],
            zindex: [
              { test: "datum === activeGeography", value: 1 },
              { value: 0 },
            ],
            tooltip: {
              signal: tooltipSignal,
            },
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
    ],
  };
});

const el = ref(null);
const { view } = useVega({
  spec,
  el,
  minHeight: ref(300),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(false),
});

let currentCluster = NULL_CLUSTER;
const emit = defineEmits(["new-active-cluster"]);

watch(view, () => {
  if (view.value) {
    view.value.addSignalListener("activeGeography", (name, value) => {
      if (value) {
        const { name, cluster_number } = value.properties;
        if (name !== currentCluster.name) {
          currentCluster = { name, cluster_number };
          emit("new-active-cluster", currentCluster);
        }
      } else {
        if (currentCluster) {
          currentCluster = NULL_CLUSTER;
          emit("new-active-cluster", currentCluster);
        }
      }
    });
  }
});
</script>
