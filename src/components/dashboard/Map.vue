<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVega } from "../../composables/useVega";

import RI_GEOJSON from "@/assets/geojson/ri.json";

import { cloneDeep } from "lodash/lang";
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
    type: Object,
    required: true,
  },
  filterTown: {
    type: String,
    required: true,
  },
});

interface Cluster {
  geometry: Record<string, unknown>;
  type: "Feature";
  properties: {
    vax_first_: number;
  };
}

interface ClusterStats {
  cluster_number: number;
  name: string;
}

const filteredTown = computed(() => {
  let filtered = cloneDeep(RI_GEOJSON);

  if (props.filterTown !== "All of Rhode Island") {
    filtered = filtered.filter((g) => props.filterTown === g.properties.name);
  }

  return filtered;
});

const filteredGeo = computed(() => {
  let filtered = cloneDeep(props.geo);

  filtered.forEach((g: Cluster) => {
    const datum: object =
      props.stats.find(
        (d: ClusterStats) => d.cluster_number === g.properties.vax_first_
      ) ?? {};

    g.properties = {
      ...g.properties,
      ...datum,
    };
  });

  const collection = {
    blocks: { type: "FeatureCollection", features: filtered },
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

const tooltipSignal = `{
  title: datum.properties.name,
  'Observed Count': datum.properties.observed_count,
  'Expected Count': datum.properties.expected_count,
}`;

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
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
        name: "hovered",
        value: null,
        on: [
          { events: "@cluster_groups:mouseover", update: "datum" },
          { events: "mouseout", update: "null" },
        ],
      },
      {
        name: "clicked",
        value: null,
        on: [
          {
            events: "@cluster_groups:mousedown",
            update: "clicked === datum ? null : datum",
          },
          {
            events: "@cluster_groups:touchstart",
            update: "clicked === datum ? null : datum",
          },
        ],
      },
      {
        name: "activeGeography",
        update: "clicked || hovered",
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
            strokeWidth: { value: 2 },
            stroke: { value: "#C7B3F9" },
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
              { test: "datum === activeGeography", value: "#386540" },
              { value: "#999999" },
            ],
            fillOpacity: [
              { test: "datum === activeGeography", value: 0.6 },
              { value: 0.3 },
            ],
            fill: [
              { test: "datum === activeGeography", value: "#7DBEA5" },
              { value: "#354156" },
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
  minHeight: ref(400),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(true),
});

let currentCluster = "";
const emit = defineEmits(["new-active-cluster"]);

watch(view, () => {
  if (view.value) {
    view.value.addSignalListener("activeGeography", (name, value) => {
      if (value) {
        if (value.properties.name !== currentCluster) {
          currentCluster = value.properties.name;
          emit("new-active-cluster", currentCluster);
        }
      } else {
        if (currentCluster) {
          currentCluster = "";
          emit("new-active-cluster", currentCluster);
        }
      }
    });
  }
});
</script>
