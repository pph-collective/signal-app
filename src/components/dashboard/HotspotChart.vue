<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";

interface Props {
  activeStats: Stat[];
  fieldData: Stat[];
  domainMax: number;
}

const props = defineProps<Props>();

const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Bar chart showing hospitalization rates by race",
    background: "transparent",
    padding: { left: 0, top: 0, right: 0, bottom: -1 },
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
        domain: [0, props.domainMax],
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
        orient: "bottom",
        scale: "xscale",
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
            x: { scale: "xscale", field: "rate" },
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
                  "{ title: datum.name, 'Hospitalizations per 100,000': format(round(datum.rate), ',.0f')}",
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
            x: { scale: "xscale", field: "rate" },
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
                'Hospitalizations per 100,000': format(round(datum.rate), ',.0f'),
                }`,
                test: "datum.population > 0",
              },
            ],
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
            x: { field: "x2", offset: 5 },
            y: { field: "y", offset: { field: "height", mult: 0.5 } },
            fill: { value: COLORS.dark },
            align: { value: "left" },
            baseline: { value: "middle" },
            text: {
              signal: `datum.datum.rate <= ${props.domainMax} * 0.75 ? format(round(datum.datum.rate), ',.0f') + ' per 100,000' : ''`,
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
              signal: `datum.datum.rate > ${props.domainMax} * 0.75 ? format(round(datum.datum.rate), ',.0f') + ' per 100,000' : ''`,
            },
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
