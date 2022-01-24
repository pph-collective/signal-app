<template>
  <LineChartDashboard :query="query">
    <template #summary-heatmap>
      <VariableHeatmap
        :summary="store.summary"
        :variables="store.variables"
        x-title="Year"
        x-unit="year"
      />
    </template>
  </LineChartDashboard>
</template>

<script setup lang="ts">
import { inject, provide, watch } from "vue";
import { useRoute } from "vue-router";

import LineChartDashboard from "@/components/buoy/LineChartDashboard.vue";
import VariableHeatmap from "@/components/buoy/VariableHeatmap.vue";

import { BuoyStore } from "../../../store/buoy";
const store = inject("store") as BuoyStore;
const route = useRoute();
import { useQuery } from "../../../composables/useQuery";
const { query, updateQuery } = useQuery(store, route.path);

updateQuery(route.query, route.path);
watch(
  () => route.query,
  (val) => updateQuery(val, route.path)
);

// set up the comparison dataset - create combined store with keys that are used
import { buoyStores } from "../../../store/buoy";
const riStore = buoyStores["ri-buoy"].useStore();
const maStore = buoyStores["ma-buoy"].useStore();
const compareStore = {
  title: "Historical",
  name: riStore.name,
  lineWidth: riStore.lineWidth,
  fetchBuoyData: async (query) => {
    const res = await Promise.all([
      riStore.fetchBuoyData(query),
      maStore.fetchBuoyData(query),
    ]);

    return res.reduce((acc, cur) => ({
      data: [...acc.data, ...cur.data],
      downsampled: acc.downsampled || cur.downsampled,
    }));
  },
};
provide("compareStore", compareStore);
</script>
