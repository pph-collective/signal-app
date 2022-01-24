<template>
  <SuspenseComponent :key="query.hash">
    <BuoyLineChart :query="query" />
  </SuspenseComponent>

  <BuoyLocations :coordinates="query.coordinates" :height="3" />

  <DashboardCard width="one-third" :height="3">
    <template #title> Keep Exploring </template>
    <template #subtitle>
      Try different variables, buoys, or changing the date range!
    </template>
    <template #content>
      <ExploreForm
        :init-variables="query.variables"
        :init-buoys="query.coordinates"
        :init-date-range="[query.startDate, query.endDate]"
      />
    </template>
  </DashboardCard>

  <DashboardCard width="two-thirds" :height="4">
    <template #title> Available Data </template>
    <template #subtitle>
      Use this heatmap to help you decide what data you want to visualize. When
      you have an idea, go ahead and select the variables and dates to explore.
    </template>
    <template #content>
      <slot name="summary-heatmap" />
    </template>
  </DashboardCard>

  <BuoyQueryDownload v-bind="query" />
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
import BuoyLocations from "@/components/buoy/LocationMap.vue";
import BuoyLineChart from "@/components/buoy/LineChartCard.vue";
import BuoyQueryDownload from "@/components/buoy/QueryDownload.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

defineProps({
  query: {
    type: Object,
    required: true,
  },
});
</script>
