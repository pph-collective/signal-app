<template>
  <LineChartDashboard :query="query">
    <template #summary-heatmap>
      <VariableHeatmap :summary="store.summary" :variables="store.variables" />
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

// set up the comparison dataset
import { buoyStores } from "../../../store/buoy";
const compareStore = buoyStores["osom"].useStore();
provide("compareStore", compareStore);
</script>
