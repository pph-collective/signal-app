<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVega } from "../../composables/useVega";

import RI_GEOJSON from "@/assets/geography/ri.json";
import HEZ_GEOJSON from "@/assets/geography/hez.json";
import { COLORS, COLOR_SCALES, NULL_CLUSTER } from "../../utils/constants";
import { formatUsString } from "../../utils/utils";

import { cloneDeep } from "lodash/lang";

import { geoToTopo } from "../../utils/utils";

const props = defineProps<{
  geo: Geo[];
  stats: Stat[];
  filterTown: string;
  focusStat: FocusStat;
  initialActiveCluster: Cluster;
  mapType: string;
  displayAsRate: boolean;
}>();

const filteredTown = computed(() => {
  let filtered = [...cloneDeep(RI_GEOJSON), ...cloneDeep(HEZ_GEOJSON)];
  if (props.filterTown !== "All of Rhode Island") {
    filtered = filtered.filter(
      (g) =>
        props.filterTown === g.properties.name ||
        props.filterTown === g.properties.HEZ,
    );
  }

  return filtered;
});

const clusters = computed(() => {
  const deepCopy = cloneDeep(props.geo);
  const filtered = [];

  deepCopy.forEach((g: Geo) => {
    const datum = props.stats.find(
      (d: { cluster_id: number }) => d.cluster_id === g.properties.cluster_id,
    );

    const additionalFields = {};
    ["total", "asian", "black", "latino", "white"].forEach((field) => {
      // Floored the gap such that it's always >= 0
      additionalFields[`gap_${field}`] = Math.max(
        0,
        datum[`expected_${field}`] - datum[`observed_${field}`],
      );

      additionalFields[`gap_${field}_pct`] =
        additionalFields[`gap_${field}`] / datum[`population_${field}`];

      additionalFields[`per100k_${field}`] =
        datum[`population_${field}`] > 0
          ? (datum[`observed_${field}`] / datum[`population_${field}`]) * 100000
          : 0;

      additionalFields[`tooltip_${field}`] = formatUsString.format(
        additionalFields[`per100k_${field}`],
      );
    });

    if (datum) {
      g.properties = {
        ...g.properties,
        ...datum,
        ...additionalFields,
      };
      filtered.push(g);
    }
  });

  return geoToTopo(filtered, 6e-10);
});

const focusFields = computed(() => {
  if (props.mapType === "cold") {
    if (props.displayAsRate) {
      return {
        name: props.focusStat.name,
        fill: `per100k_${props.focusStat.value}`,
        tooltip: `gap_${props.focusStat.value}`,
        population: `population_${props.focusStat.value}`,
      };
    } else {
      return {
        name: props.focusStat.name,
        fill: `gap_${props.focusStat.value}_pct`,
        tooltip: `gap_${props.focusStat.value}`,
        population: `population_${props.focusStat.value}`,
      };
    }
  } else {
    return {
      name: props.focusStat.name,
      fill: `per100k_${props.focusStat.value}`,
      tooltip: `tooltip_${props.focusStat.value}`,
      population: `population_${props.focusStat.value}`,
    };
  }
});

const tooltipSignal = computed(() => {
  if (props.mapType === "cold") {
    if (props.displayAsRate) {
      return `{
        title: datum.properties.name
        , 'Gap per 100,000 among ${focusFields.value.name.toLocaleLowerCase()}': datum.properties.${
          focusFields.value.population
        } > 0 ? format(datum.properties.${
          focusFields.value.fill
        }, ',.0d') : 'Not enough information'
        , 'Absolute gap among ${focusFields.value.name.toLowerCase()}': datum.properties.${
          focusFields.value.population
        } > 0 ? datum.properties.${
          focusFields.value.tooltip
        } : 'Not enough information'
      }`;
    } else {
      return `{
        title: datum.properties.name
        , 'Percent gap among ${focusFields.value.name.toLowerCase()}': datum.properties.${
          focusFields.value.population
        } > 0 ? format(datum.properties.${
          focusFields.value.fill
        }, '.1%') : 'Not enough information'
        , 'Dose gap among ${focusFields.value.name.toLowerCase()}': datum.properties.${
          focusFields.value.population
        } > 0 ? datum.properties.${
          focusFields.value.tooltip
        } : 'Not enough information'
      }`;
    }
  } else {
    return `{
      title: datum.properties.name
      , 'Rate of hospitalization among ${focusFields.value.name.toLowerCase()}': datum.properties.${
        focusFields.value.population
      } > 0 ? datum.properties.${
        focusFields.value.tooltip
      } + ' per 100,000' : 'Not enough information'
    }`;
  }
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
        value: props.initialActiveCluster.cluster_id,
        on: [
          {
            events: "@cluster_groups:mousedown",
            update: `activeGeography === datum.properties.cluster_id ? ${NULL_CLUSTER.cluster_id} : datum.properties.cluster_id`,
          },
          {
            events: "@cluster_groups:touchend",
            update: `activeGeography === datum.properties.cluster_id ? ${NULL_CLUSTER.cluster_id} : datum.properties.cluster_id`,
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
    scales: [
      {
        name: "color",
        type: "linear",
        domain: {
          data: "cluster_outlines",
          field: `properties.${focusFields.value.fill}`,
        },
        range: COLOR_SCALES[props.mapType],
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
              {
                test: "datum.properties.cluster_id === activeGeography",
                value: COLORS.green,
              },
              { value: COLORS.grey },
            ],
            fillOpacity: { value: 0.7 },
            fill: [
              {
                test: "datum.properties.cluster_id === activeGeography",
                value: COLORS.link,
              },
              {
                test: `datum.properties.${focusFields.value.population} > 0`,
                scale: "color",
                field: `properties.${focusFields.value.fill}`,
              },
              { value: "url(#diagonalHatch)" },
            ],
            zindex: [
              {
                test: "datum.properties.cluster_id === activeGeography",
                value: 1,
              },
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

/* eslint-disable vue/no-setup-props-destructure */
let currentClusterId = props.initialActiveCluster.cluster_id;
const emit = defineEmits(["new-active-cluster-id"]);

watch(view, () => {
  if (view.value) {
    view.value.addSignalListener("activeGeography", (name, value) => {
      currentClusterId = value;
      emit("new-active-cluster-id", currentClusterId);
    });
  }
});
</script>
