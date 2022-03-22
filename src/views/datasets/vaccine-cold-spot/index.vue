<template>
  <DashboardCard width="full" :height="1">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" @selected="updateControls" />
    </template>
  </DashboardCard>

  <DashboardCard width="two-thirds" :height="5">
    <template #title
      >Map: {{ zoomed ? activeCluster.name : "All Cold Spots" }}</template
    >

    <template #top-right>
      <button
        :disabled="!activeCluster.name || !activeClusterClicked"
        class="zoom-button button is-secondary is-light ml-4"
        @click="zoomed = !zoomed"
      >
        <span class="icon">
          <i
            class="fas fa-search-plus"
            :class="[zoomed ? 'fa-search-minus' : 'fa-search-plus']"
          ></i>
        </span>
        <span>{{ zoomed ? "Zoom Back Out" : "Zoom to Cold Spot" }}</span>
      </button>
    </template>

    <template #content>
      <div class="map-container">
        <ColdMap
          :geo="geo"
          :stats="stats"
          :filter-town="controls.town"
          :fill-stat="controls.fillStat"
          class="is-absolute"
          @new-active-cluster="activeCluster = $event"
          @cluster-clicked="activeClusterClicked = $event"
        />
        <ClusterMap
          v-if="activeCluster && zoomed"
          :cluster="activeCluster"
          :geo="geo"
          :locations="[]"
          class="is-absolute"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="4">
    <template #title>Side panel</template>
    <template #content> Active Cluster: {{ activeCluster.name }} </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="2">
    <template #title>Gap by Race</template>
    <template #content>
      <GapChart
        :stats="stats"
        :active-cluster="activeCluster.name"
        :field-names="['asian', 'black', 'latino', 'white']"
      />
    </template>
  </DashboardCard>

  <DashboardCard width="full">
    <template #title>Moar Info</template>
    <template #subtitle>Details about the things</template>
    <template #content> Below the fold things </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import RI_GEOJSON from "@/assets/geography/ri.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapChart from "@/components/dashboard/GapChart.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";

const activeCluster = ref(NULL_CLUSTER);
const activeClusterClicked = ref(false);
const zoomed = ref(false);

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const { geo: initialGeo, stats: initialStats } = await fetchColdSpotData(
  datasetName,
  dates[0]
);
const geo = ref(initialGeo);
const stats = ref(initialStats);

const datesDropdownValues = dates.map((date) => {
  const dateString = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return { name: dateString, value: date };
});

const townDefault = "All of Rhode Island";
const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const dropDowns = computed(() => {
  return {
    fillStat: {
      label: "Which statistic would you like to highlight on the map?",
      icon: "fas fa-fill-drip",
      values: [
        { name: "None", value: "" },
        { name: "Overall Gap", value: "overall_gap" },
        {
          name: "Doses to close gap for White residents",
          value: "doses_to_close_gap_white",
        },
        {
          name: "Doses to close gap for Black residents",
          value: "doses_to_close_gap_black",
        },
        {
          name: "Doses to close gap for Latino residents",
          value: "doses_to_close_gap_latino",
        },
        {
          name: "Doses to close gap for Asian residents",
          value: "doses_to_close_gap_asian",
        },
        { name: "Doses to close gap for youth", value: "youth_gap" },
        { name: "Doses to close gap for adults", value: "adult_gap" },
      ],
    },
    town: {
      icon: "fas fa-globe",
      label: "Where do you want to look into?",
      values: [townDefault, ...towns],
    },
    date: {
      icon: "fas fa-calendar-alt",
      label: "When are you interested in?",
      values: datesDropdownValues,
    },
  };
});

const controls = ref({
  fillStat: dropDowns.value.fillStat.values[0],
  date: datesDropdownValues[0],
  town: townDefault,
});
const updateControls = (newControls) => {
  if (newControls.date !== controls.value.date.value) {
    fetchColdSpotData(datasetName, newControls.date.value).then((res) => {
      geo.value = res.geo;
      stats.value = res.stats;
    });
  }

  // update the control selections
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};
</script>

<style scoped>
.map-container {
  max-width: 95vw;
  height: 80vh;
  max-height: 1280px;
  position: relative;
}

.zoom-button {
  white-space: nowrap;
  min-width: 12rem; /* 192 px */
}

.is-absolute {
  position: absolute;
}
</style>
