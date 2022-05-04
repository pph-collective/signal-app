<template>
  <!--
    Depending on the controls, display different charts and layouts

    Implementation:
    Each child of the outer-container is stacked on top of each other taking
    up space and is hidden based on the visible class. Conditional rendering
    would cause resizing of the container which is jarring for the user.

    Use the visible class to determine which is shown rather than
    v-if / v-else-if / v-else
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

    <!-- A focus stat selected, display KPI -->
    <div
      class="gap-container"
      :class="{ visible: focusStat.value !== 'total' }"
    >
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-around"
      >
        <KeyPerformanceIndicator
          :value="
            activeFocusStats?.population > 0
              ? formatPct(activeFocusStats?.pct)
              : '?'
          "
          :title="`${activeFocusStats?.name} residents vaccinated in ${activeCluster.name}`"
        />
        <KeyPerformanceIndicator
          :value="
            activeFocusStats?.population > 0 ? activeFocusStats?.gap : '?'
          "
          :title="`Vaccine doses for ${activeFocusStats?.name} residents needed to close the gap`"
        />
      </div>
      <div class="content centered">
        <!-- In this community, there is a gap in this focus group -->
        <p v-if="activeFocusStats?.gap > 0" class="has-text-centered">
          In {{ activeCluster.name }},
          <strong>{{ formatPct(activeFocusStats?.pct) }}</strong> of
          {{ activeFocusStats?.name }} residents are vaccinated compared to our
          goal of {{ formatPct(expected) }} total vaccinations statewide.
          <strong
            >{{ activeFocusStats?.gap }} more
            {{ activeFocusStats?.name }} residents</strong
          >
          need to be vaccinated to close this gap.
        </p>
        <!-- There is no gap in this focus group, display the largest gap -->
        <span v-else class="has-text-centered">
          <!-- Fully Vaccinated -->
          <p v-if="activeFocusStats?.population > 0">
            In {{ activeCluster.name }},
            <strong>{{ formatPct(activeFocusStats?.pct) }}</strong> of
            {{ activeFocusStats?.name }} residents are vaccinated compared to
            our goal of {{ formatPct(expected) }} total vaccinations statewide.
          </p>

          <!-- Not Enough Information-->
          <p v-else>
            In {{ activeCluster.name }}, there isn't enough vaccine data on
            <strong>{{ activeFocusStats?.name }} residents</strong> to determine
            their vaccination status or the number of vaccine doses needed to
            close the gap.
          </p>

          <!-- Largest Gap -->
          <p>
            The largest gap is among
            <strong>{{ minVaxRace?.name }} residents</strong>. Only
            <strong>{{ formatPct(minVaxRace?.pct) }}</strong> of
            {{ minVaxRace?.name }} residents are vaccinated.
            <strong>{{ minVaxRace?.gap }}</strong> more
            {{ minVaxRace?.name }} residents need to be vaccinated to close this
            gap.
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import GapChart from "@/components/dashboard/GapChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { formatPct, sortByProperty } from "../../utils/utils";

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
    return fieldData.value
      .map((f) => {
        const population = row[f.populationField];
        return {
          name: f.name,
          pct:
            population > 0
              ? Math.min(1, row[f.observedField] / row[f.populationField])
              : NaN,
          gap: Math.max(0, row[f.expectedField] - row[f.observedField]),
          population,
        };
      })
      .sort(sortByProperty("pct"));
  } else {
    return [];
  }
});

const minVaxRace = computed(() => activeStats.value[0]);

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase()
  );
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
  grid-template-areas: "content";
  place-items: center;

  > * {
    grid-area: content;
  }
}
</style>
