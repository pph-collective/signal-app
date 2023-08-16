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
          :domain-max="maxInclAll?.rate * 1.35"
        />
      </div>
      <div class="centered">
        <div class="content centered has-text-centered">
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-html="
              sanitizeHtml(
                allResidents({
                  name: props.activeCluster.name,
                  rate: round(maxRace?.rate).toLocaleString('en-US'),
                  maxRaceName: maxRace?.name,
                })
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
              ? round(activeFocusStats?.rate).toLocaleString()
              : '?'
          "
          :title="
            sanitizeHtml(
              kpiTitle({
                race: activeFocusStats?.name,
                name: props.activeCluster.name,
              })
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
                rate: round(activeFocusStats?.rate).toLocaleString(),
                race: activeFocusStats?.name,
              })
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
                  rate: round(activeFocusStats?.rate).toLocaleString(),
                  race: activeFocusStats?.name,
                })
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
                })
              )
            "
          ></p>

          <!-- Highest rate -->
          <p
            v-html="
              sanitizeHtml(
                highest({
                  race: maxRace?.name,
                  rate: round(maxRace?.rate).toLocaleString(),
                  startDate:
                    parseISOlocal(date).getMonth() >= 10
                      ? format(parseISOlocal(date), 'MMMM yyyy')
                      : format(parseISOlocal(date), 'MMMM'),
                  endDate: format(
                    add(parseISOlocal(date), { months: 2 }),
                    'MMMM yyyy'
                  ),
                })
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
import { format, add } from "date-fns";

import HotspotChart from "@/components/dashboard/HotspotChart.vue";
import KeyPerformanceIndicator from "@/components/dashboard/KeyPerformanceIndicator.vue";
import { parseISOlocal, sortByProperty } from "../../utils/utils";
import { round } from "lodash";
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

const maxInclAll = computed(() => {
  for (const activeStat of activeStats.value) {
    if (!isNaN(activeStat.rate)) {
      return activeStat;
    }
  }
  return activeStats.value[0];
});

const activeFocusStats = computed(() => {
  return activeStats.value.find(
    (a) => a.name.toUpperCase() === props.focusStat.value.toUpperCase()
  );
});

const gapPhrase = compile(props.phrases.gap);
const allResidents = compile(props.phrases.allResidents);
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
