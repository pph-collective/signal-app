<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVega } from "../../composables/useVega";

import RI_GEOJSON from "@/assets/geography/ri.json";
import NEIGHBORS from "@/assets/geography/neighbors.json";
import { COLORS, NULL_CLUSTER, COLOR_SCALES } from "../../utils/constants";

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
  fillStat: {
    type: Object,
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

const fill = computed(() => {
  return [
    { test: "datum === activeGeography", value: COLORS.link },
    props.fillStat.value
      ? { scale: "color", field: `properties.${props.fillStat.value}` }
      : { value: COLORS.grey },
  ];
});

const clusters = computed(() => {
  const deepCopy = cloneDeep(props.geo);
  const filtered = [];

  deepCopy.forEach((g: { properties: Record<string, any> }) => {
    const datum: Record<string, any> = props.stats.find(
      (d: { cluster_number: number }) =>
        d.cluster_number === g.properties.vax_first_
    );

    if (datum) {
      g.properties = {
        ...g.properties,
        ...datum,
        overall_gap: 1 - datum.observed_count / datum.expected_count,
        youth_gap: datum.expected_youth - datum.doses_youth,
        adult_gap: datum.expected_adult - datum.doses_adult,
      };
      filtered.push(g);
    }
  });

  return geoToTopo(filtered);
});

const tooltipSignal = computed(() => {
  let tooltip = `{
  title: datum.properties.name,
  'Observed Count': datum.properties.observed_count,
  'Expected Count': datum.properties.expected_count,
  'Overall Gap': format(datum.properties.overall_gap, ".0%"),`;

  if (props.fillStat.value && props.fillStat.value !== "overall_gap") {
    tooltip += `'${props.fillStat.name}': datum.properties.${props.fillStat.value},`;
  }
  tooltip += "}";

  return tooltip;
});

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
        values: clusters.value,
        format: { type: "topojson", feature: "blocks" },
      },
      {
        name: "town_outlines",
        values: filteredTown.value,
      },
    ],
    scales: props.fillStat.value
      ? [
          {
            name: "color",
            type: "linear",
            domain: {
              data: "cluster_outlines",
              field: `properties.${props.fillStat.value}`,
            },
            range: COLOR_SCALES.primary,
          },
        ]
      : [],
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
              { value: COLORS.grey },
            ],
            fillOpacity: { value: 0.7 },
            fill: fill.value,
            zindex: [
              { test: "datum === activeGeography", value: 1 },
              { value: 0 },
            ],
            tooltip: {
              signal: tooltipSignal.value,
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
