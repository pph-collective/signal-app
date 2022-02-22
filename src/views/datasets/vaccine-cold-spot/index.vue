<template>
  <DashboardCard width="two-thirds" :height="1">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" />
    </template>
  </DashboardCard>

  <DashboardCard width="two-thirds" :height="4">
    <template #title>Vaccine Cold Spots</template>
    <template #content>
      <div class="map-container">
        <Map
          :geo="geo"
          :stats="stats"
          @new-active-cluster="activeCluster = $event"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="4">
    <template #title>Side panel</template>
    <template #content> Active Cluster: {{ activeCluster }} </template>
  </DashboardCard>

  <DashboardCard width="full">
    <template #title>Moar Info</template>
    <template #subtitle>Details about the things</template>
    <template #content>
      <p>below the fold things</p>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import Map from "@/components/dashboard/Map.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const { geo, stats } = await fetchColdSpotData(datasetName, dates[0]);
const activeCluster = ref("");

const dropDowns = computed(() => {
  return {
    cluster: {
      icon: "fas fa-globe",
      values: stats ? stats.map((cluster) => cluster.name).sort() : [],
    },
    dates: {
      icon: "fas fa-calendar-alt",
      values: dates,
    },
  };
});
</script>

<style scoped>
.map-container {
  max-width: 95vw;
  height: 80vh;
  max-height: 1280px;
  position: relative;
}
</style>
