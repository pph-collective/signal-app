<template>
  <!--
    Depending on the controls, display different charts and layouts

    Implementation:
    Each child of the outer-container is stacked on top of each other taking up space and his hidden based on the
    visible class. Conditional rendering would cause resizing of the container which is jarring for the user.

    Use the visible class to determine which is shown rather than v-if / v-else-if / v-else
  -->
  <div class="outer-container">
    <!-- All Residents, display the Gap Chart -->
    <div
      class="gap-container"
      :class="{ visible: focusStat.value === 'total' }"
    >
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

    <!-- A focus stat selected and the population for the focus group is valid, display KPI -->
    <div
      class="gap-container"
      :class="{
        visible:
          focusStat.value !== 'total' && activeFocusStats?.population > 0,
      }"
    >
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-around"
      >
        <KeyPerformanceIndicator
          :value="formatPct(activeFocusStats?.pct)"
          :title="`${activeFocusStats?.name} residents vaccinated in ${activeCluster.name}`"
        />
        <KeyPerformanceIndicator
          :value="activeFocusStats?.gap ?? NaN"
          :title="`Vaccine doses for ${activeFocusStats?.name} residents needed to close the gap`"
        />
      </div>
      <div class="centered">
        <p class="has-text-centered">
          In {{ activeCluster.name }},
          <strong>{{ formatPct(activeFocusStats?.pct) }}</strong> of
          {{ activeFocusStats?.name }} residents are are vaccinated compared to
          our goal of {{ formatPct(expected) }} total vaccinations statewide.
          <strong
            >{{ activeFocusStats?.gap }} more
            {{ activeFocusStats?.name }} residents</strong
          >
          need to be vaccinated to close this gap.
        </p>
      </div>
    </div>

    <!-- A focus stat selected and population for the focus group is invalid, display a message -->
    <div
      class="gap-container"
      :class="{
        visible:
          focusStat.value !== 'total' && activeFocusStats?.population === 0,
      }"
    >
      There isn't enough vaccine data on {{ activeFocusStats?.name }} residents
      in {{ activeCluster.name }}.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import GapChart from "@/components/dashboard/GapChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { formatPct } from "../../utils/utils";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: string[];
  focusStat: FocusStat;
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

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase()
  );
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

<style scoped lang="scss">
.gap-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
  max-width: 100%;
  visibility: hidden;
}

.centered {
  display: grid;
  place-content: center;
}

.visible {
  visibility: visible;
}

// Stacks all children on top of each other
// Source: https://stackoverflow.com/questions/1909648/stacking-divs-on-top-of-each-other
.outer-container {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;

  > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }
}
</style>
