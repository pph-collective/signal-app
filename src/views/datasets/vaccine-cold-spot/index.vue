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
          :filter-clusters="controls.cluster"
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
import { sortByProperty } from "../../../utils/utils";

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

const ri = { name: "All of Rhode Island", cluster_number: -1 };
const dropDowns = computed(() => {
  const clusters = stats.value
    .map((cluster) => {
      return {
        name: cluster.name,
        cluster_number: cluster.cluster_number,
      };
    })
    .sort(sortByProperty("name"));

  return {
    cluster: {
      icon: "fas fa-globe",
      values: [ri, ...clusters],
    },
    date: {
      icon: "fas fa-calendar-alt",
      values: datesDropdownValues,
    },
  };
});

const controls = ref({
  cluster: ri,
  date: datesDropdownValues[0],
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
