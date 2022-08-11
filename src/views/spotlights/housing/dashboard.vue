<template>
  <DashboardCard width="full">
    <template #subtitle>
      This section will conceptualize what's on the page
    </template>
    <template #content>
      What will users find? What information are they gathering?
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" :init-value="controls" />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <DataSpotlight />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <DataSpotlight />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DataSpotlight from "@/components/dashboard/DataSpotlight.vue";
import ControlPanel from "../../../components/dashboard/ControlPanel.vue";

const dropDowns = {
  metric: {
    icon: "fas fa-poll",
    label: "What metric do you want to see?",
    values: [
      { name: "Cases", value: "cases" },
      { name: "Hospitalizations", value: "Hospitalizations" },
      { name: "Deaths", value: "deaths" },
    ],
  },
};

const controls = ref({
  metric: dropDowns.metric.values[0],
});
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
