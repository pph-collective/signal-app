<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Legend } from "vega";

import { useVega } from "../../composables/useVega";

import { formatVariable } from "../../utils/utils";
import { Variable, Data } from "../../utils/erddap";

const props = defineProps<{
  variables: Variable[];
  x: string;
  y: string;
  compareDataset: Data[];
  compareLineWidth: number;
  compareName: string;
  dataset: Data[];
  datasetLineWidth: number;
  datasetName: string;
  colorDomain: string[];
  colorRange: string[];
  weatherDataset: object[];
}>();

const DASHES = [
  [1, 0],
  [1, 1],
  [3, 1],
  [5, 2],
];

const lineDashes = computed(() => DASHES.slice(0, props.variables.length));
const yTitle = computed(() =>
  props.variables.length === 1
    ? formatVariable(props.variables[0])
    : "Variables"
);

const legends = computed(() => {
  const legend: Legend[] = [
    {
      title: "Buoys",
      fill: "color",
      orient: "top",
    },
  ];
  if (props.compareDataset.length > 0) {
    legend.push({
      title: "Datasets",
      strokeWidth: "lineWidth",
      orient: "top",
      symbolType: "stroke",
    });
  }
  if (props.variables.length > 1) {
    legend.push({
      title: "Variables",
      strokeDash: "lineDash",
      orient: "top",
      symbolType: "stroke",
    });
  }

  return legend;
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description:
      "A basic line chart example, with value labels shown upon mouse hover.",
    height: 850,
    padding: 5,
    autosize: { type: "fit-x", resize: true },

    data: [
      {
        name: "buoy",
        values: props.dataset,
        transform: [
          { type: "formula", as: "dataset", expr: `'${props.datasetName}'` },
        ],
      },
      {
        name: "compare",
        values: props.compareDataset,
        transform: [
          { type: "formula", as: "dataset", expr: `'${props.compareName}'` },
        ],
      },
      {
        name: "union",
        source: ["buoy", "compare"],
        transform: [
          {
            type: "formula",
            expr: "toDate(datum.time)",
            as: "time",
          },
          {
            type: "formula",
            expr: 'datum.variable + (datum.units ? " (" + datum.units + ")" : "")',
            as: "unittedVariable",
          },
        ],
      },
      {
        name: "unionNonNull",
        source: "union",
        transform: [
          {
            type: "filter",
            expr: "datum.value !== null",
          },
        ],
      },
      {
        name: "weather",
        values: props.weatherDataset,
      },
    ],

    scales: [
      {
        name: "xscale",
        type: "time",
        domain: {
          fields: [
            {
              data: "weather",
              field: "date",
            },
            { data: "union", field: "time" },
          ],
        },
        range: "width",
        padding: 0.05,
        round: true,
      },
      {
        name: "yscale",
        type: "linear",
        domain: {
          fields: [{ data: "union", field: "value" }],
        },
        nice: true,
        zero: false,
        range: [500, 0],
      },
      {
        name: "color",
        type: "ordinal",
        range: props.colorRange,
        domain: props.colorDomain,
      },
      {
        name: "lineWidth",
        type: "ordinal",
        range: [props.datasetLineWidth, props.compareLineWidth],
        domain: [props.datasetName, props.compareName],
      },
      {
        name: "lineDash",
        type: "ordinal",
        range: lineDashes.value,
        domain: props.variables.map(formatVariable),
      },
      {
        name: "tempScale",
        type: "linear",
        domain: {
          data: "weather",
          fields: ["minTemp", "maxTemp"],
        },
        nice: true,
        zero: false,
        range: [200, 0],
      },
      {
        name: "precipScale",
        type: "linear",
        domain: {
          data: "weather",
          field: "precipitation",
        },
        nice: true,
        zero: false,
        range: [200, 0],
      },
      {
        name: "colorScale",
        type: "ordinal",
        domain: ["min", "avg", "max"],
        range: ["cornflowerblue", "black", "red"],
      },
      {
        name: "rainScale",
        type: "ordinal",
        domain: ["total"],
        range: ["grey"],
      },
    ],

    marks: [
      {
        type: "group",

        encode: {
          enter: {
            y: { value: 0 },
            width: { signal: "width" },
            height: { value: 500 },
          },
        },

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
          { orient: "bottom", scale: "xscale" },
          { orient: "left", scale: "yscale", title: yTitle.value },
        ],

        legends: legends.value,

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
            from: { data: "unionNonNull" },
            encode: {
              enter: {
                fill: { scale: "color", field: "station_name" },
                x: { scale: "xscale", field: props.x },
                y: { scale: "yscale", field: "value" },
              },
              update: {
                size: {
                  signal: 'pow(scale("lineWidth", datum.dataset), 2)',
                },
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
                  signal: `{ 'Variable': datum.datum.unittedVariable, 'Value': format(datum.datum.value, '.3f'), 'Date': utcFormat(datum.datum.${props.x}, '%Y-%m-%dT%H:%M:%S.%LZ'), 'Buoy': datum.datum.${props.y}, 'Dataset': datum.datum.dataset }`,
                },
              },
            },
            transform: [
              {
                type: "voronoi",
                x: "datum.x",
                y: "datum.y",
                size: [{ signal: "width" }, 500],
              },
            ],
          },

          {
            type: "group",
            from: {
              facet: {
                name: "series",
                data: "union",
                groupby: ["station_name", "unittedVariable", "dataset"],
              },
            },
            marks: [
              {
                type: "line",
                name: "lines",
                from: { data: "series" },
                encode: {
                  enter: {
                    x: { scale: "xscale", field: props.x },
                    y: { scale: "yscale", field: "value" },
                    stroke: { scale: "color", field: props.y },
                    strokeWidth: { scale: "lineWidth", field: "dataset" },
                    strokeDash: {
                      scale: "lineDash",
                      field: "unittedVariable",
                    },
                    interactive: false,
                    strokeOpacity: { value: 0.9 },
                    defined: { signal: "datum.value !== null" },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        type: "group",
        title: { text: "Providence Area Weather", anchor: "start", dy: -5 },

        encode: {
          enter: {
            y: { value: 570 },
            width: { signal: "width" },
            height: { value: 200 },
          },
        },

        axes: [
          { orient: "bottom", scale: "xscale", title: "Time" },
          {
            orient: "left",
            scale: "tempScale",
            title: "Temperature (°C)",
            grid: false,
          },
          {
            orient: "right",
            scale: "precipScale",
            title: "Precipitation (in/day)",
            grid: false,
          },
        ],

        legends: [
          {
            stroke: "colorScale",
            orient: "bottom",
            direction: "horizontal",
            title: "Temperature",
            symbolType: "stroke",
          },
          {
            stroke: "rainScale",
            orient: "bottom",
            direction: "horizontal",
            title: "Precipitation",
            encode: {
              symbols: {
                enter: {
                  shape: { value: "stroke" },
                  angle: { value: 90 },
                },
              },
            },
          },
        ],

        marks: [
          {
            type: "line",
            from: { data: "weather" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "date" },
                y: { scale: "tempScale", field: "minTemp" },
                stroke: { scale: "colorScale", value: "min" },
                strokeWidth: { value: 1 },
                strokeOpacity: { value: 0.9 },
                zindex: { value: 1 },
              },
            },
          },
          {
            type: "line",
            from: { data: "weather" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "date" },
                y: { scale: "tempScale", field: "maxTemp" },
                stroke: { scale: "colorScale", value: "max" },
                strokeWidth: { value: 1 },
                strokeOpacity: { value: 0.9 },
                zindex: { value: 1 },
              },
            },
          },
          {
            type: "line",
            from: { data: "weather" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "date" },
                y: { scale: "tempScale", field: "avgTemp" },
                stroke: { scale: "colorScale", value: "avg" },
                strokeWidth: { value: 1 },
                strokeOpacity: { value: 0.9 },
                zindex: { value: 1 },
              },
            },
          },
          {
            type: "rect",
            from: { data: "weather" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "date" },
                width: { value: 1 },
                y: { scale: "precipScale", value: 0 },
                y2: { scale: "precipScale", field: "precipitation" },
                fill: { scale: "rainScale", value: "total" },
                opacity: { value: 0.7 },
              },
            },
          },
        ],
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
