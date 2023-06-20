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
        <HotspotChart
          :active-stats="activeStats"
          :field-data="fieldData"
          :domain-max="maxRace?.rate * 1.35"
        />
      </div>
      <div class="centered">
        <p class="has-text-centered">
          In {{ activeCluster.name }}, the rate of people who were
          {{ props.metric }} was highest among {{ maxRace?.name }} residents.
          About
          <strong
            >{{ round(maxRace?.rate).toLocaleString("en-US") }}
            {{ props.ratePhrase }} {{ maxRace?.name }} residents</strong
          >
          were {{ props.metric }} in
          {{
            parseISOlocal(date).getMonth() >= 10
              ? format(parseISOlocal(date), "MMMM yyyy")
              : format(parseISOlocal(date), "MMMM")
          }},
          {{
            parseISOlocal(date).getMonth() >= 10
              ? format(add(parseISOlocal(date), { months: 1 }), "MMMM yyyy")
              : format(add(parseISOlocal(date), { months: 1 }), "MMMM")
          }}, and
          {{ format(add(parseISOlocal(date), { months: 2 }), "MMMM yyyy") }}.
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
              ? round(activeFocusStats?.rate).toLocaleString()
              : '?'
          "
          :title="`${props.ratePhrase} ${activeFocusStats?.name} residents ${props.metric} in ${activeCluster.name}`"
        />
      </div>
      <div class="content centered has-text-centered">
        <!-- In this community, there is a gap in this focus group -->
        <p v-if="activeFocusStats?.gap > 0 && activeFocusStats?.population > 0">
          In {{ activeCluster.name }}, about
          <strong>{{ round(activeFocusStats?.rate).toLocaleString() }}</strong>
          {{ props.ratePhrase }} {{ activeFocusStats?.name }} residents were
          {{ props.metric }}. This was higher than the average rate in Rhode
          Island.
        </p>
        <!-- There is no gap in this focus group, display the largest gap -->
        <span v-else>
          <p v-if="activeFocusStats?.population > 0">
            In {{ activeCluster.name }}, about
            <strong>{{
              round(activeFocusStats?.rate).toLocaleString()
            }}</strong>
            {{ props.ratePhrase }} {{ activeFocusStats?.name }} residents were
            {{ props.metric }}. This was lower than the average rate in Rhode
            Island.
          </p>
          <!-- Not enough information -->
          <p v-else>
            In {{ activeCluster.name }}, there isn't enough
            {{ props.metric }} data on
            <strong>{{ activeFocusStats?.name }} residents</strong> to determine
            their {{ props.metric }} rate.
          </p>

          <!-- Highest rate -->
          <p>
            The highest rate of {{ props.metric }} was among
            <strong>{{ maxRace?.name }} residents</strong>. About
            <strong>{{ round(maxRace?.rate).toLocaleString() }}</strong>
            {{ props.ratePhrase }}
            {{ maxRace?.name }}
            residents were {{ props.metric }} in
            {{
              parseISOlocal(date).getMonth() === 11
                ? format(parseISOlocal(date), "MMMM yyyy")
                : format(parseISOlocal(date), "MMMM")
            }}
            and
            {{ format(add(parseISOlocal(date), { months: 1 }), "MMMM yyyy") }}.
          </p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { format, add } from "date-fns";

import HotspotChart from "@/components/dashboard/HotspotChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { parseISOlocal, sortByProperty } from "../../utils/utils";
import { round } from "lodash";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: Array<{ field: string; name: string }>;
  focusStat: FocusStat;
  date: string;
  metric: string;
  ratePhrase: string;
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
              ? (row[f.observedField] / row[f.populationField]) * 100000
              : NaN,
          gap: Math.max(0, row[f.observedField] - row[f.expectedField]),
          population,
        };
      })
      .sort(sortByProperty("rate"))
      .reverse();
  } else {
    return [];
  }
});

// activeStats is sorted by pct, minVaxRace is the first group whose percentage gap is not NaN
const maxRace = computed(() => {
  for (const activeStat of activeStats.value) {
    if (!isNaN(activeStat.rate) && activeStat.name !== "All Residents") {
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
