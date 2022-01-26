<template>
  <DashboardCard width="two-thirds">
    <template #title>Vaccine Cold Spots</template>
    <template #content>
      A Map someday
      {{ dates }}
      {{ data }}
    </template>
  </DashboardCard>

  <DashboardCard width="one-third">
    <template #title>Side panel</template>
    <template #content> stats for days </template>
  </DashboardCard>

  <DashboardCard with="full">
    <template #title>Moar Info</template>
    <template #subtitle>Details about the things</template>
    <template #content>
      <p>below the fold things</p>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";
const dates = await fetchKeys("vaccine_cold_spot");
const data = await fetchColdSpotData("vaccine_cold_spot", dates[0]);
</script>

<style scoped></style>
