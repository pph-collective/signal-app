<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVega } from "../../composables/useVega";

import { cloneDeep } from "lodash/lang";

import { NULL_CLUSTER } from "../../utils/constants";
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
    background: "transparent",
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
  includeActions: ref(false),
});

let currentCluster = NULL_CLUSTER;
const emit = defineEmits(["new-active-cluster", "cluster-clicked"]);

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

    view.value.addSignalListener("clicked", (name, value) => {
      const clicked = value !== null;
      emit("cluster-clicked", clicked);
    });
  }
});
</script>
