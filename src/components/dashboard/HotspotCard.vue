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
    <!-- All Residents, display the hotspot chart -->
    <div
      class="signal-grid-container"
      :class="focusStat.value === 'total' ? '' : 'is-invisible'"
    >
      <div>
        <HotspotChart :active-stats="activeStats" :field-data="fieldData" />
      </div>
      <div class="centered">
        <p class="has-text-centered">
          In {{ activeCluster.name }} the highest rate of hospitalization is
          among {{ maxHospRace?.name }} residents. As many as
          {{ activeFocusStats?.population }}
          <strong
            >{{ round(maxHospRace?.rate) }} per 10,000
            {{ maxHospRace?.name }} residents</strong
          >
          were hospitalized in {{ prettyDate(date) }}.
        </p>
      </div>
    </div>

    <!-- A focus stat selected, display KPI -->
    <div
      class="signal-grid-container"
      :class="focusStat.value === 'total' ? 'is-invisible' : ''"
    >
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-around"
      >
        <KeyPerformanceIndicator
          :value="
            activeFocusStats?.population > 0
              ? round(activeFocusStats?.rate)
              : '?'
          "
          :title="`${activeFocusStats?.name} residents hospitalized in ${activeCluster.name}`"
        />
      </div>
      <div class="content centered has-text-centered">
        <!-- In this community, there is a gap in this focus group -->
        <p v-if="activeFocusStats?.gap > 0">
          In {{ activeCluster.name }},
          <strong>{{ round(activeFocusStats?.rate) }}</strong> per 10,000
          {{ activeFocusStats?.name }} residents were hospitalized. This was
          higher than the average rate in Rhode Island.
        </p>
        <!-- There is no gap in this focus group, display the largest gap -->
        <span v-else>
          <p v-if="activeFocusStats?.population > 0">Text if no "gap"</p>
          <!-- Not enough information -->
          <p v-else>
            In {{ activeCluster.name }}, there isn't enough hospitalization data
            on <strong>{{ activeFocusStats?.name }} residents</strong> to
            determine their hospitalization rate.
          </p>

          <!-- Highest rate -->
          <p>
            The highest rate of hospitalization is among
            <strong>{{ maxHospRace?.name }} residents</strong>.
            <strong>{{ round(maxHospRace?.rate) }}</strong> per 10,000
            {{ maxHospRace?.name }}
            residents were hospitalized in [this period?]
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import HotspotChart from "@/components/dashboard/HotspotChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { prettyDate, sortByProperty } from "../../utils/utils";
import { round } from "lodash";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: Array<{ field: string; name: string }>;
  focusStat: FocusStat;
  date: string;
}>();

const fieldData = computed(() => {
  return props.fieldNames.map((f) => ({
    name: f.name,
    observedField: `observed_${f.field}`,
    populationField: `population_${f.field}`,
    expectedField: `expected_${f.field}`,
  }));
});

const activeStats = computed(() => {
  const row = props.stats.find(
    (stat) => stat.name === props.activeCluster.name
  );
  if (row) {
    return fieldData.value
      .map((f) => {
        const population = row[f.populationField];
        return {
          name: f.name,
          rate:
            population > 0
              ? (row[f.observedField] / row[f.populationField]) * 10000
              : NaN,
          gap: Math.max(0, row[f.observedField] - row[f.expectedField]),
          population,
        };
      })
      .sort(sortByProperty("rate"))
      .reverse(); // TODO should I reverse the array or update sortByProperty to allow reverse sorting?
  } else {
    return [];
  }
});

// activeStats is sorted by pct, minVaxRace is the first group whose percentage gap is not NaN
const maxHospRace = computed(() => {
  for (const activeStat of activeStats.value) {
    if (!isNaN(activeStat.rate)) {
      return activeStat;
    }
  }

  // shouldn't reach here, but if it does return the first one
  return activeStats.value[0];
});

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase()
  );
});
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
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
