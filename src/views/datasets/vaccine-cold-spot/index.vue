<template>
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
        <Map
          :geo="geo"
          :stats="stats"
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

  <DashboardCard width="one-third" :height="3">
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
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import Map from "@/components/dashboard/Map.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapChart from "@/components/dashboard/GapChart.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const { geo, stats } = await fetchColdSpotData(datasetName, dates[0]);

const activeCluster = ref(NULL_CLUSTER);
const activeClusterClicked = ref(false);
const zoomed = ref(false);
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
