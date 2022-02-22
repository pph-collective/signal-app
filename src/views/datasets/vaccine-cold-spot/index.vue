<template>
  <DashboardCard width="two-thirds" :height="1" style="">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" @selected="updateControls" />
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="5">
    <template #title>Side panel</template>
    <template #content> Active Cluster: {{ activeCluster }} </template>
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

const activeCluster = ref("");
const geo = ref([]);
const stats = ref([]);

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);

const dropDowns = computed(() => {
  return {
    cluster: {
      icon: "fas fa-globe",
      values: stats.value.map((cluster) => cluster.name).sort(),
    },
    date: {
      icon: "fas fa-calendar-alt",
      values: dates,
    },
  };
});

const controls = ref({
  cluster: "",
  date: "",
});
const updateControls = (newControls) => {
  if (newControls.date !== controls.value.date) {
    fetchColdSpotData(datasetName, newControls.date).then((res) => {
      geo.value = res.geo;
      stats.value = res.stats;
    });
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
