<template>
  <DashboardCard width="two-thirds">
    <template #title>Vaccine Cold Spots</template>
    <template #content>
      <div class="map-container">
        <Map :geo="geo" :stats="stats" />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third">
    <template #title>Side panel</template>
    <template #content> stats for days </template>
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
import DashboardCard from "@/components/base/DashboardCard.vue";
import Map from "@/components/dashboard/Map.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";
const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const { geo, stats } = await fetchColdSpotData(datasetName, dates[0]);
</script>

<style scoped>
.map-container {
  max-width: 95vw;
  height: 80vh;
  max-height: 1280px;
  position: relative;
}
</style>
