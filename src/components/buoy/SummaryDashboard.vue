<template>
  <DashboardCard width="two-thirds">
    <template #title> Available Data </template>
    <template #subtitle>
      <slot name="available-data" />
    </template>
    <template #content>
      <slot name="heatmap" />
    </template>
  </DashboardCard>

  <BuoyLocations :coordinates="store.coordinates" />

  <DashboardCard width="half">
    <template #title> Explore </template>
    <template #subtitle>
      Here you can generate a line plot comparing one variable for multiple
      buoys over time. Just select the variable, the buoys, and the time range.
      Use the heatmap above to check what data are available.
    </template>
    <template #content>
      <ExploreForm />
    </template>
  </DashboardCard>

  <DashboardCard width="half" :height="1">
    <template #title> Not sure what to explore? </template>
    <template #subtitle>
      Here are a few pre-selected scenarios for you. Just pick one and start
      exploring.
    </template>
    <template #content>
      <div class="is-flex-column">
        <router-link
          v-for="(scenario, key) in scenarios"
          :key="key"
          class="button is-primary my-1"
          :to="generateQuery(scenario.query)"
        >
          {{ scenario.name }}
        </router-link>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half align-self-start">
    <template #title> Download </template>
    <template #subtitle>
      If you prefer, we provide the raw data for you to download in various file
      formats. Just select from the options below.
    </template>
    <template #content>
      <DownloadForm />
    </template>
  </DashboardCard>

  <DashboardCard width="half" :height="1">
    <template #title> Learn More </template>
    <template #subtitle>
      <div class="content">
        <slot name="learn-more" />
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import BuoyLocations from "@/components/buoy/LocationMap.vue";

interface Query {
  ids: string;
  variables: string;
  start: string;
  end: string;
}

interface Scenario {
  name: string;
  path: string;
  query: Query;
}

defineProps<{
  scenarios: Scenario[];
}>();

import { BuoyStore } from "../../store/buoy";
const store = inject("store") as BuoyStore;

const generateQuery = (query: Query) => {
  const queryParams = Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  return `/dataset/${store.name}/dashboard?${queryParams}`;
};
</script>

<style lang="scss" scoped>
.align-self-start {
  align-self: start;
}
</style>
