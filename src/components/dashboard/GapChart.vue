<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";
import { COLORS } from "../../utils/constants";

interface Stat {
  name: string;
  expected_count: number;
  coldspot_population: number;
}

interface Props {
  stats: Stat[];
  activeCluster: string;
  fieldNames: string[];
}

const props = defineProps<Props>();

// the expected percent is constant, so we can calculate it from the first row of data
const expected = computed(
  () => props.stats[0].expected_count / props.stats[0].coldspot_population
);

// TODO: these fields will change when the data reporting is normalized to have actual / population
const fieldData = computed(() => {
  const upperFirst = (val) =>
    val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase();
  return props.fieldNames.map((f) => ({
    name: upperFirst(f),
    actualField: `doses_${f}`,
    expectedField: `doses_to_close_gap_${f}`,
    populationField: `population_${f}`,
  }));
});

// TODO: this is temporary as this should be fixed on the data side
const parseNum = (val) =>
  typeof val === "string" ? parseInt(val.replaceAll(",", "")) : val;

// TODO: these calcs will change when the data reporting is normalized to have actual / population
const activeStats = computed(() => {
  const row = props.stats.find((stat) => stat.name === props.activeCluster);

  if (row) {
    // don't let a population be more than 100% vaccinated
    return fieldData.value.map((f) => ({
      name: f.name,
      pct: Math.min(
        1,
        parseNum(row[f.actualField]) / parseNum(row[f.populationField])
      ),
      gap: parseNum(row[f.expectedField]),
    }));
  } else {
    return [];
  }
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Bar chart showing the gap in vaccinations by race",
    background: "transparent",
    padding: { left: 5, top: 0, right: 5, bottom: 0 },

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
        padding: 0.2,
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
            x2: { scale: "xscale", value: expected.value },
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
              signal:
                "{ title: datum.name, 'Percent Vaccinated': format(datum.pct, '.0%'), 'Doses to Close Gap': datum.gap}",
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
            xc: { signal: "datum.x + datum.width / 2" },
            y: { field: "y", offset: { field: "height", mult: 0.5 } },
            fill: { value: COLORS.dark },
            align: { value: "center" },
            baseline: { value: "middle" },
            text: {
              signal:
                "datum.datum.gap > 0 && datum.width > 60 ? datum.datum.gap + ' doses' : datum.datum.gap > 0 && datum.width > 25 ? datum.datum.gap : ''",
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
  minHeight: ref(150),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(false),
});
</script>
