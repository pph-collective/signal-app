<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useVega } from "../../composables/useVega";

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  colorRange: {
    type: Array,
    required: true,
  },
  stations: {
    type: Array,
    required: true,
  },
});

const locationSpec = (location, ySpec) => {
  return {
    type: "group",
    desctiption: `${location} Water Temperature`,
    name: location.replace(" ", "_"),

    encode: {
      enter: {
        y: { signal: ySpec },
        width: { signal: "width" },
        height: { signal: "chartHeight" },
      },
    },

    data: [
      {
        name: "loc_temps",
        source: "temps",
        transform: [
          { type: "filter", expr: `datum.Station === "${location}"` },
          { type: "filter", expr: 'datum.level === "Surface"' },
        ],
      },
    ],

    signals: [
      {
        name: "hovered",
        value: null,
        on: [
          { events: "@voronoi:mouseover", update: "datum" },
          { events: "mouseout", update: "null" },
        ],
      },
    ],

    axes: [
      { orient: "bottom", scale: "xscale", labelOverlap: true },
      {
        orient: "left",
        scale: "ytemps",
        title: "Surface Δ °C from Mean",
        grid: false,
      },
    ],

    marks: [
      {
        type: "symbol",
        zindex: 1,
        encode: {
          enter: {
            size: { value: 20 },
          },
          update: {
            fill: [
              { test: "!hovered", value: "transparent" },
              { value: "black" },
            ],
            x: { signal: "hovered && hovered.x" },
            y: { signal: "hovered && hovered.y" },
          },
        },
      },

      {
        type: "symbol",
        name: "secret_symbols",
        from: { data: "loc_temps" },
        encode: {
          enter: {
            fill: { value: "transparent" },
            x: { scale: "xscale", field: "utc_time" },
            y: { scale: "ytemps", field: "delta" },
          },
        },
      },

      {
        type: "path",
        name: "voronoi",
        from: { data: "secret_symbols" },
        encode: {
          enter: {
            stroke: { value: "transparent" },
            fill: { value: "transparent" },
            tooltip: {
              signal:
                "{ 'Water Temp. Δ from Seasonally Adjusted Mean': format(datum.datum.delta, ',.3f') + ' °C', 'Level': datum.datum.level, 'Month/Year': monthFormat(utcmonth(datum.datum.utc_time)) + ' ' + utcyear(datum.datum.utc_time), 'Station': datum.datum.Station }",
            },
          },
        },
        transform: [
          {
            type: "voronoi",
            x: "datum.x",
            y: "datum.y",
            size: [{ signal: "width" }, { signal: "chartHeight" }],
          },
        ],
      },

      {
        type: "group",
        from: {
          facet: {
            name: "series",
            data: "loc_temps",
            groupby: ["key"],
          },
        },
        marks: [
          {
            type: "rect",
            from: { data: "series" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "utc_time" },
                y: { scale: "ytemps", field: "delta" },
                y2: { signal: 'scale("ytemps", 0)' },
                stroke: { signal: `scale("color", "${location}")` },
                interactive: false,
                defined: { signal: "datum.delta != null" },
              },
            },
          },
        ],
      },
    ],
  };
};

const tempDiffSpec = () => {
  return {
    type: "group",
    desctiption: "Difference Water Temperature Bottom/Surface",
    name: "tempdiff",

    encode: {
      enter: {
        y: { signal: "height * 2 / 3" },
        width: { signal: "width" },
        height: { signal: "chartHeight" },
      },
    },

    data: [
      {
        name: "diff_temps",
        source: "temps",
        transform: [
          {
            type: "pivot",
            groupby: ["Station", "utc_time"],
            field: "level",
            value: "mean_temp",
          },
          {
            type: "formula",
            as: "diff",
            expr: "datum.Surface && datum.Bottom ? datum.Surface - datum.Bottom : null",
          },
        ],
      },
    ],

    signals: [
      {
        name: "hovered",
        value: null,
        on: [
          { events: "@voronoi:mouseover", update: "datum" },
          { events: "mouseout", update: "null" },
        ],
      },
    ],

    scales: [
      {
        name: "ydiffs",
        type: "linear",
        domain: { data: "diff_temps", field: "diff" },
        nice: true,
        zero: true,
        range: [{ signal: "chartHeight" }, 0],
      },
    ],

    axes: [
      {
        orient: "bottom",
        scale: "xscale",
        title: "Month/Year",
        labelOverlap: true,
      },
      {
        orient: "left",
        scale: "ydiffs",
        title: "Δ °C Suface - Bottom",
        grid: false,
      },
    ],

    marks: [
      {
        type: "symbol",
        zindex: 1,
        encode: {
          enter: {
            size: { value: 20 },
          },
          update: {
            fill: [
              { test: "!hovered", value: "transparent" },
              { value: "black" },
            ],
            x: { signal: "hovered && hovered.x" },
            y: { signal: "hovered && hovered.y" },
          },
        },
      },

      {
        type: "symbol",
        name: "secret_symbols",
        from: { data: "diff_temps" },
        encode: {
          enter: {
            fill: { value: "transparent" },
            x: { scale: "xscale", field: "utc_time" },
            y: { scale: "ydiffs", field: "diff" },
          },
        },
      },

      {
        type: "path",
        name: "voronoi",
        from: { data: "secret_symbols" },
        encode: {
          enter: {
            stroke: { value: "transparent" },
            fill: { value: "transparent" },
            tooltip: {
              signal:
                "{ 'Water Temp. Δ Surface - Bottom': format(datum.datum.diff, ',.3f') + ' °C', 'Month/Year': monthFormat(utcmonth(datum.datum.utc_time)) + ' ' + utcyear(datum.datum.utc_time), 'Station': datum.datum.Station }",
            },
          },
        },
        transform: [
          {
            type: "voronoi",
            x: "datum.x",
            y: "datum.y",
            size: [{ signal: "width" }, { signal: "chartHeight" }],
          },
        ],
      },

      {
        type: "group",
        from: {
          facet: {
            name: "series",
            data: "diff_temps",
            groupby: ["Station"],
          },
        },
        marks: [
          {
            type: "line",
            from: { data: "series" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "utc_time" },
                y: { scale: "ydiffs", field: "diff" },
                stroke: { signal: 'scale("color", datum.Station)' },
                strokeWidth: 1,
                interactive: false,
                defined: { signal: "datum.diff != null" },
              },
            },
          },
        ],
      },
    ],
  };
};

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    title: "Water Temperature Data",
    description:
      "Fish trawl survey temperature data charts, with value labels shown upon mouse hover.",
    height: 500,
    padding: 5,

    signals: [
      {
        name: "chartHeight",
        update: "height / 3 - 20",
      },
    ],

    data: [
      {
        name: "temps",
        values: props.dataset,
        transform: [
          {
            type: "formula",
            as: "utc_time",
            expr: "utcParse(datum.year_month, '%Y-%m-%dT%H:%M:%S.%LZ')",
          },
        ],
      },
    ],

    scales: [
      {
        name: "xscale",
        type: "utc",
        domain: { data: "temps", field: "utc_time" },
        range: "width",
        padding: 0.05,
        round: true,
      },
      {
        name: "ytemps",
        type: "linear",
        domain: { data: "temps", field: "delta" },
        nice: true,
        zero: true,
        range: [{ signal: "chartHeight" }, 0],
      },
      {
        name: "color",
        type: "ordinal",
        range: props.colorRange,
        domain: props.stations,
      },
    ],

    marks: [
      locationSpec("Whale Rock", "0"),
      locationSpec("Fox Island", "height / 3"),
      tempDiffSpec(),
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
