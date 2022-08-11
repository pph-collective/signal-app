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
      <ControlPanel
        :drop-downs="dropDowns"
        :init-value="controls"
        @selected="updateControls"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title> Spotlight: COVID {{ controls.focusStat.name }} </template>
    <template #content>
      <DataSpotlight :metric="controls.focusStat" />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <!-- TODO how do I make this not change the above value -->
      <ControlPanel
        :drop-downs="dropDowns"
        :init-value="controls"
        @selected="updateControls"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <DataSpotlight />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
// TODO: I think I need useQueryParams? Or updateControls
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DataSpotlight from "@/components/dashboard/DataSpotlight.vue";
import ControlPanel from "../../../components/dashboard/ControlPanel.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

// TODO: How do i make this default to the first?
const dropDowns = {
  focusStat: {
    icon: "fas fa-poll",
    label: "What metric do you want to see?",
    values: [
      { name: "Cases", value: "cases" },
      { name: "Hospitalizations", value: "hospitalizations" },
      { name: "Deaths", value: "deaths" },
    ],
  },
};

const controls = ref({
  focusStat: dropDowns.focusStat.values[0],
});
// TODO useQueryParam???
useQueryParam({
  param: "stat",
  ref: controls,
  refField: "focusStat",
  valid: (p) => p === p,
});

const updateControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
