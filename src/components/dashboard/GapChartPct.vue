<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";

interface Props {
  activeStats: Stat[];
  expected: number;
  fieldData: Stat[];
}

const props = defineProps<Props>();

const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Bar chart showing the gap by race",
    background: "transparent",
    padding: { left: 0, top: 0, right: 0, bottom: -1 },
    autosize: {
      type: "fit",
      resize: true,
      contains: "padding",
    },

    data: [
      {
        name: "yFields",
        values: props.fieldData,
      },
      {
        name: "stats",
        values: props.activeStats,
      },
    ],

    scales: [
      {
        name: "xscale",
        domain: [0, Math.min(props.expected * 1.5, 1)],
        range: "width",
      },
      {
        name: "yscale",
        type: "band",
        domain: { data: "yFields", field: "name" },
        range: "height",
        padding: 0.3,
      },
    ],

    axes: [
      {
        title: "Percent Vaccinated",
        orient: "bottom",
        scale: "xscale",
        format: ".0%",
        labelOverlap: "parity",
        labelSeparation: 4,
        domain: false,
        ticks: false,
        labelFontSize: remSize * 0.7,
      },
      {
        orient: "left",
        scale: "yscale",
        ticks: false,
        domainWidth: 1,
        domainColor: COLORS.dark,
        labelFontWeight: 700,
        labelPadding: 5,
        offset: 1.5,
        labelFontSize: remSize * 0.7,
      },
    ],

    marks: [
      {
        name: "bars",
        type: "rect",
        from: { data: "stats" },
        encode: {
          enter: {
            x: { scale: "xscale", field: "pct" },
            x2: { scale: "xscale", value: 0 },
            yc: {
              signal: "scale('yscale', datum.name) + bandwidth('yscale') / 2",
            },
            height: { scale: "yscale", band: 1 },
            fill: { value: COLORS.dark },
            stroke: [{ value: COLORS.dark, test: `datum.population > 0` }],
          },
          update: {
            opacity: { value: 0.9 },
            tooltip: [
              {
                signal:
                  "{ title: datum.name, 'Percent Vaccinated': format(datum.pct, '.0%'), 'Doses to Close Gap': datum.gap}",
                test: "datum.population > 0",
              },
            ],
          },
          hover: {
            opacity: { value: 1.0 },
          },
        },
      },
      {
        name: "gaps",
        type: "rect",
        from: { data: "stats" },
        encode: {
          enter: {
            x: { scale: "xscale", field: "pct" },
            x2: { scale: "xscale", value: props.expected },
            yc: {
              signal: "scale('yscale', datum.name) + bandwidth('yscale') / 2",
            },
            height: { scale: "yscale", band: 1 },
            stroke: [{ value: COLORS.dark, test: `datum.population > 0` }],
            strokeDash: { value: [1, 1] },
            fill: { value: "transparent" },
          },
          update: {
            tooltip: [
              {
                signal: `{
                title: datum.name,
                'Percent Vaccinated': format(datum.pct, '.0%'),
                'Doses to Close Gap': datum.gap
                }`,
                test: "datum.population > 0",
              },
            ],
            fill: { value: "transparent" },
          },
          hover: {
            fill: { value: COLORS.info },
          },
          exit: {
            fill: { value: "transparent" },
          },
        },
      },
      {
        type: "text",
        interactive: false,
        from: { data: "gaps" },
        encode: {
          enter: {
            xc: { signal: "datum.x + 5" },
            y: { field: "y", offset: { field: "height", mult: 0.5 } },
            fill: { value: COLORS.dark },
            baseline: { value: "middle" },
            text: {
              signal: `datum.datum.population === 0 ? 'Not enough information' : ''`,
            },
          },
        },
      },
      {
        type: "text",
        from: { data: "bars" },
        encode: {
          enter: {
            x: { scale: "xscale", value: props.expected, offset: 5 },
            y: { field: "y", offset: { field: "height", mult: 0.5 } },
            fill: { value: COLORS.dark },
            align: { value: "left" },
            baseline: { value: "middle" },
            text: {
              signal:
                "datum.datum.gap > 0 && datum.datum.population > 0 ? datum.datum.gap + ' doses' : ''",
            },
          },
        },
      },
      {
        type: "text",
        from: { data: "bars" },
        encode: {
          enter: {
            x: { field: "x2", offset: -5 },
            y: { field: "y", offset: { field: "height", mult: 0.5 } },
            fill: { value: "#FFFFFF" },
            align: { value: "right" },
            baseline: { value: "middle" },
            text: {
              signal: "format(datum.datum.pct, '.0%')",
            },
          },
        },
      },
      {
        type: "rule",
        encode: {
          enter: {
            x: { scale: "xscale", value: props.expected },
            y: { value: 0 },
            y2: { signal: "height" },
            stroke: { value: COLORS.dark },
            strokeDash: { value: [2, 2] },
            strokeWidth: { value: 1 },
          },
        },
      },
    ],
  };
});

const el = ref(null);
useVega({
  spec,
  el,
  minHeight: ref(180),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(false),
});
</script>
