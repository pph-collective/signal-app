<template>
  <SuspenseComponent :key="species">
    <FishChartCard :species="species" />
  </SuspenseComponent>

  <BuoyLocations :coordinates="store.coordinates" location-type="Survey" />

  <DashboardCard width="one-third" :height="2">
    <template #title>Keep Exploring</template>
    <template #subtitle>Pick another species to learn more about!</template>
    <template #content>
      <FishExploreForm />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import DashboardCard from "@/components/base/DashboardCard.vue";
import BuoyLocations from "@/components/buoy/LocationMap.vue";
import FishExploreForm from "@/components/fish/FishExploreForm.vue";
import FishChartCard from "@/components/fish/FishChartCard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

import { useFishStore } from "../../../store/fish";
const store = useFishStore();
const route = useRoute();

const species = computed(() => route.query.species);
</script>
