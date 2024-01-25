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
      class="signal-grid-container"
      :class="focusStat.value === 'total' ? '' : 'is-invisible'"
    >
      <div>
        <GapChartRate
          v-if="displayAsRate"
          :active-stats="activeStats"
          :expected="expectedRate"
          :field-data="fieldData"
        />
        <GapChartPct
          v-else
          :active-stats="activeStats"
          :expected="expectedPct"
          :field-data="fieldData"
        />
      </div>
      <div class="centered">
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="has-text-centered"
          v-html="
            sanitizeHtml(
              allResidents({
                name: activeCluster.name,
                minRaceName: minVaxRace?.name,
                pct: formatPct(minVaxRace?.pct),
                expectedPct: formatPct(expectedPct),
                gap: minVaxRace?.gap,
                rate: formatUsString(minVaxRace?.rate),
                expectedRate: formatUsString(expectedRate),
              }),
            )
          "
        />
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
          :value="kpiValue"
          :title="
            sanitizeHtml(
              kpiTitle({
                race: activeFocusStats?.name,
                name: props.activeCluster.name,
              }),
            )
          "
        />
        <KeyPerformanceIndicator
          :value="
            activeFocusStats?.population > 0 ? activeFocusStats?.gap : '?'
          "
          :title="
            sanitizeHtml(
              gapKpiTitle({
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
        <p
          v-if="activeFocusStats?.gap > 0 && activeFocusStats?.population > 0"
          v-html="
            sanitizeHtml(
              gapPhrase({
                name: props.activeCluster.name,
                pct: formatPct(activeFocusStats?.pct),
                rate: formatUsString(activeFocusStats?.rate),
                race: activeFocusStats?.name,
                expectedPct: formatPct(expectedPct),
                expectedRate: formatUsString(expectedRate),
                gap: activeFocusStats?.gap,
              }),
            )
          "
        />
        <!-- There is no gap in this focus group, display the largest gap -->
        <span v-else>
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-if="activeFocusStats?.population > 0"
            v-html="
              sanitizeHtml(
                noGap({
                  name: props.activeCluster.name,
                  pct: formatPct(activeFocusStats?.pct),
                  race: activeFocusStats?.name,
                  expectedPct: formatPct(expectedPct),
                }),
              )
            "
          />

          <!-- Not Enough Information-->
          <!-- eslint-disable vue/no-v-html -->
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
          />

          <!-- Largest Gap, displayed when no gap or not enough info -->
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-html="
              sanitizeHtml(
                highest({
                  minRaceName: minVaxRace?.name,
                  pct: formatPct(minVaxRace?.pct),
                  rate: formatUsString(minVaxRace?.rate),
                  gap: minVaxRace?.gap,
                }),
              )
            "
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import GapChartPct from "@/components/dashboard/GapChartPct.vue";
import GapChartRate from "@/components/dashboard/GapChartRate.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { formatPct, sortByProperty, formatUsString } from "../../utils/utils";
import { compile } from "handlebars";
import sanitizeHtml from "sanitize-html";

const props = defineProps<{
  stats: Stat[];
  activeCluster: Cluster;
  fieldNames: Array<{ field: string; name: string }>;
  focusStat: FocusStat;
  phrases: Phrases;
  displayAsRate: boolean;
}>();

const expectedPct = computed(
  () => props.stats[0].expected_total / props.stats[0].population_total,
);

const expectedRate = computed(
  () =>
    (props.stats[0].expected_total / props.stats[0].population_total) * 100000,
);

const fieldData = computed(() => {
  return props.fieldNames.map((f) => ({
    name: f.name,
    observedField: `observed_${f.field}`,
    expectedField: `expected_${f.field}`,
    populationField: `population_${f.field}`,
  }));
});

const activeStats = computed(() => {
  const row = props.stats.find(
    (stat) => stat.name === props.activeCluster.name,
  );
  if (row) {
    // don't let a population be more than 99% vaccinated
    return fieldData.value
      .map((f) => {
        const population = row[f.populationField];
        return {
          name: f.name,
          pct:
            population > 0
              ? Math.min(0.99, row[f.observedField] / row[f.populationField])
              : NaN,
          rate:
            population > 0
              ? (row[f.observedField] / row[f.populationField]) * 100000
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

// activeStats is sorted by pct, minVaxRace is the first group whose percentage gap is not NaN
const minVaxRace = computed(() => {
  for (const activeStat of activeStats.value) {
    if (!isNaN(activeStat.pct)) {
      return activeStat;
    }
  }

  // shouldn't reach here, but if it does return the first one
  return activeStats.value[0];
});

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase(),
  );
});

const kpiValue = computed(() => {
  if (activeFocusStats.value?.population > 0) {
    if (props.displayAsRate) {
      return formatUsString(activeFocusStats.value?.rate);
    } else {
      return formatPct(activeFocusStats.value?.pct);
    }
  } else {
    return "?";
  }
});

const gapPhrase = compile(props.phrases.gap);
const allResidents = compile(props.phrases.allResidents);
const noGap = compile(props.phrases.noGap);
const noInfo = compile(props.phrases.noInfo);
const highest = compile(props.phrases.highest);
const kpiTitle = compile(props.phrases.kpiTitle);
const gapKpiTitle = compile(props.phrases.gapKpiTitle);
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
