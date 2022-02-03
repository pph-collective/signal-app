<template>
  <DashboardCard width="two-thirds">
    <template #title>Vaccine Cold Spots</template>
    <template #content>
      A Map someday
      {{ dates }}
      {{ `${JSON.stringify(data).substring(0, 1000)}...` }}
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
const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const data = await fetchColdSpotData(datasetName, dates[0]);
</script>

<style scoped></style>
