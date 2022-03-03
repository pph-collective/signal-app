<template>
  <DashboardCard width="two-thirds" :height="1" style="">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" @selected="updateControls" />
    </template>
  </DashboardCard>

  <DashboardCard width="two-thirds" :height="5">
    <template #title>Vaccine Cold Spots</template>
    <template #content>
      <div class="map-container">
        <Map
          :geo="geo"
          :stats="stats"
          :filter-town="controls.town"
          @new-active-cluster="activeCluster = $event"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="3">
    <template #title>Side panel</template>
    <template #content> Active Cluster: {{ activeCluster }} </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="2">
    <template #title>Gap by Race</template>
    <template #content>
      <GapChart
        :stats="stats"
        :active-cluster="activeCluster"
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

import RI_GEOJSON from "@/assets/geojson/ri.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import Map from "@/components/dashboard/Map.vue";
import GapChart from "@/components/dashboard/GapChart.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";

const activeCluster = ref("");
const geo = ref([]);
const stats = ref([]);

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const datesDropdownValues = dates.map((date) => {
  const dateString = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return { name: dateString, value: date };
});

const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const dropDowns = computed(() => {
  return {
    town: {
      icon: "fas fa-globe",
      values: ["All of Rhode Island", ...towns],
    },
    date: {
      icon: "fas fa-calendar-alt",
      values: datesDropdownValues,
    },
  };
});

const controls = ref({
  date: datesDropdownValues[0],
  town: "All of Rhode Island",
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
</style>
