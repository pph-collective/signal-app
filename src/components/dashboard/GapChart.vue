<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS, NA_TEXT } from "../../utils/constants";

interface Props {
  stats: Stat[];
  activeCluster: string;
  fieldNames: string[];
}

const props = defineProps<Props>();

// the expected percent is constant, so we can calculate it from the first row of data
const expected = computed(
  () => props.stats[0].expected_total / props.stats[0].population_total
);

const fieldData = computed(() => {
  const upperFirst = (val) =>
    val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase();
  return props.fieldNames.map((f) => ({
    name: upperFirst(f),
    observedField: `observed_${f}`,
    expectedField: `expected_${f}`,
    populationField: `population_${f}`,
  }));
});

const activeStats = computed(() => {
  const row = props.stats.find((stat) => stat.name === props.activeCluster);

  if (row) {
    // don't let a population be more than 100% vaccinated
    return fieldData.value.map((f) => {
      const population = row[f.populationField];

      return {
        name: f.name,
        pct:
          population > 0 ? Math.min(1, row[f.observedField] / population) : 0,
        gap: Math.max(0, row[f.expectedField] - row[f.observedField]),
        population,
      };
    });
  } else {
    return [];
  }
});

const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Bar chart showing the gap in vaccinations by race",
    background: "transparent",
    padding: { left: 0, top: 0, right: 0, bottom: -1 },

    data: [
      {
        name: "yFields",
        values: fieldData.value,
      },
      {
        name: "stats",
        values: activeStats.value,
      },
    ],

    scales: [
      {
        name: "xscale",
        domain: [0, 1],
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
            stroke: { value: COLORS.dark },
          },
          update: {
            opacity: { value: 0.9 },
            tooltip: {
              signal:
                "{ title: datum.name, 'Percent Vaccinated': format(datum.pct, '.0%'), 'Doses to Close Gap': datum.gap}",
            },
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
            x2: {
              scale: "xscale",
              value: `datum.population > 0 ? ${expected.value} : 0`,
            },
            yc: {
              signal: "scale('yscale', datum.name) + bandwidth('yscale') / 2",
            },
            height: { scale: "yscale", band: 1 },
            stroke: { value: COLORS.dark },
            strokeDash: { value: [1, 1] },
            fill: { value: "transparent" },
          },
          update: {
            tooltip: {
              signal: `{
                title: datum.name,
                'Percent Vaccinated': datum.population > 0 ? format(datum.pct, '.0%') : '${NA_TEXT}',
                'Doses to Close Gap': datum.population > 0 ? datum.gap : '${NA_TEXT}'
                }`,
            },
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
              signal: `datum.datum.population === 0 ? '${NA_TEXT}' : ''`,
            },
          },
        },
      },
      {
        type: "rule",
        encode: {
          enter: {
            x: { scale: "xscale", value: expected.value },
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
