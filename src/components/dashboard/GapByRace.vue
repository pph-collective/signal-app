<template>
  <div class="signal-grid-container">
    <div>
      <GapChart
        :active-stats="activeStats"
        :expected="expected"
        :field-data="fieldData"
      />
    </div>
    <div class="centered">
      <p class="has-text-centered">
        In {{ activeCluster.name }}, the largest gap is among
        {{ minVaxRace?.name }} residents. Only
        <strong
          >{{ formatPct(minVaxRace?.pct) }} of
          {{ minVaxRace?.name }} residents</strong
        >
        are vaccinated compared to {{ formatPct(expected) }} statewide.
        <strong
          >{{ minVaxRace?.gap }} more {{ minVaxRace?.name }} residents</strong
        >
        need to be vaccinated to close this gap.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import GapChart from "@/components/dashboard/GapChart.vue";
import { formatPct } from "../../utils/utils";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: string[];
}>();

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
  const row = props.stats.find(
    (stat) => stat.name === props.activeCluster.name
  );
  if (row) {
    // don't let a population be more than 100% vaccinated
    return fieldData.value.map((f) => {
      const population = row[f.populationField];
      return {
        name: f.name,
        pct:
          population > 0
            ? Math.min(1, row[f.observedField] / row[f.populationField])
            : 0,
        gap: Math.max(0, row[f.expectedField] - row[f.observedField]),
        population,
      };
    });
  } else {
    return [];
  }
});

const minVaxRace = computed(() => {
  let minRow = activeStats.value[0];
  activeStats.value.forEach((stat) => {
    if (stat.pct < minRow.pct) {
      minRow = stat;
    }
  });
  return minRow;
});
</script>

<style scoped>
.centered {
  display: grid;
  place-content: center;
}
</style>
