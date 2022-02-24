<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVega } from "../../composables/useVega";

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

const expected = computed(
  () => props.stats[0].expected_count / props.stats[0].coldspot_population
);

const fieldData = computed(() => {
  const upperFirst = (val) =>
    val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase();
  return props.fieldNames.map((f) => ({
    name: upperFirst(f),
    actualField: `doses_${f}`,
    populationField: `population_${f}`,
  }));
});

const activeStats = computed(() => {
  const row = props.stats.find((stat) => stat.name === props.activeCluster);

  if (row) {
    // don't let a population be more than 100% vaccinated
    return fieldData.value.map((f) => ({
      name: f.name,
      pct: Math.min(1, row[f.actualField] / row[f.populationField]),
    }));
  } else {
    return [];
  }
});

const spec = computed(() => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    background: "transparent",

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
        padding: 0.05,
      },
    ],

    axes: [
      { orient: "bottom", scale: "xscale" },
      { orient: "left", scale: "yscale" },
    ],

    marks: [
      {
        type: "rect",
        from: { data: "yFields" },
        encode: {
          enter: {
            x: { scale: "xscale", value: expected.value },
            x2: { scale: "xscale", value: 0 },
            y: { scale: "yscale", field: "name" },
            height: { scale: "yscale", band: 1 },
            opacity: { value: 0.5 },
          },
        },
      },
      {
        type: "rect",
        from: { data: "stats" },
        encode: {
          enter: {
            x: { scale: "xscale", field: "pct" },
            x2: { scale: "xscale", value: 0 },
            yc: {
              signal: "scale('yscale', datum.name) + bandwidth('yscale') / 2",
            },
            height: { scale: "yscale", band: 0.4 },
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
  minHeight: ref(200),
  maxHeight: ref(1280),
  maxWidth: ref(1280),
  includeActions: ref(true),
});
</script>
