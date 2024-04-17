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
          :domain-max="maxRate * 1.35"
        />
      </div>
      <div class="centered">
        <div class="content centered has-text-centered">
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="maxRace?.name === 'All Residents'"
            v-html="
              sanitizeHtml(
                allHighest({
                  name: props.activeCluster.name,
                  rate: formatUsString(maxRace?.rate),
                }),
              )
            "
          />
          <div
            v-else
            v-html="
              sanitizeHtml(
                allResidents({
                  name: props.activeCluster.name,
                  rate: formatUsString(maxRace?.rate),
                  maxRaceName: maxRace?.name,
                }),
              )
            "
          />
        </div>
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
              ? formatUsString(activeFocusStats?.rate)
              : '?'
          "
          :title="
            sanitizeHtml(
              kpiTitle({
                race: activeFocusStats?.name,
                name: props.activeCluster.name,
              }),
            )
          "
        />
      </div>
      <div class="content centered has-text-centered">
        <!-- In this community, there is a gap in this focus group -->
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="activeFocusStats?.gap > 0 && activeFocusStats?.population > 0"
          v-html="
            sanitizeHtml(
              gapPhrase({
                name: props.activeCluster.name,
                rate: formatUsString(activeFocusStats?.rate),
                race: activeFocusStats?.name,
              }),
            )
          "
        />

        <!-- There is no gap in this focus group, display the largest gap -->
        <span v-else>
          <p
            v-if="activeFocusStats?.population > 0"
            v-html="
              sanitizeHtml(
                noGap({
                  name: props.activeCluster.name,
                  rate: formatUsString(activeFocusStats?.rate),
                  race: activeFocusStats?.name,
                }),
              )
            "
          />
          <!-- Not enough information -->
          <p
            v-else
            v-html="
              sanitizeHtml(
                noInfo({
                  name: props.activeCluster.name,
                  race: activeFocusStats?.name,
                }),
              )
            "
          ></p>

          <!-- Highest rate -->
          <div
            v-if="maxRace?.name === 'All Residents'"
            v-html="
              sanitizeHtml(
                allHighest({
                  name: props.activeCluster.name,
                  rate: formatUsString(maxRace?.rate),
                }),
              )
            "
          />
          <p
            v-else
            v-html="
              sanitizeHtml(
                highest({
                  race: maxRace?.name,
                  rate: formatUsString(maxRace?.rate),
                }),
              )
            "
          ></p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import HotspotChart from "@/components/dashboard/HotspotChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { sortByProperty, formatUsString } from "../../utils/utils";
import { compile } from "handlebars";
import sanitizeHtml from "sanitize-html";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: Array<{ field: string; name: string }>;
  focusStat: FocusStat;
  date: string;
  phrases: Phrases;
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
    (stat) => stat.name === props.activeCluster.name,
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

  // reaches here if all races are suppressed, so return all residents
  return activeStats.value.find(({ name }) => name === "All Residents");
});

const maxRate = computed(() => {
  const rates = activeStats.value.map((stat) => isNaN(stat.rate) ? 0 : stat.rate)
  console.log(Math.max(...rates))
  return Math.max(...rates)
});

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase(),
  );
});

const gapPhrase = compile(props.phrases.gap);
const allResidents = compile(props.phrases.allResidents);
const allHighest = compile(props.phrases.allHighest);
const noGap = compile(props.phrases.noGap);
const noInfo = compile(props.phrases.noInfo);
const highest = compile(props.phrases.highest);
const kpiTitle = compile(props.phrases.kpiTitle);
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
