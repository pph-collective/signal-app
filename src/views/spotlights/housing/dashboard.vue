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
        :drop-downs="outcomeDropDown"
        :init-value="outcomeControls"
        @selected="updateOutcomeControls"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>
      Spotlight: COVID {{ outcomeControls.focusStat.name }}
    </template>
    <template #content>
      <DataSpotlight :metric="outcomeControls.focusStat" />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <ControlPanel
        :drop-downs="crowdingDropDown"
        :init-value="crowdingControls"
        @selected="updateCrowdingControls"
      />
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #title>
      Spotlight: {{ crowdingControls.focusStat.name }} By Affordability
    </template>
    <template #content>
      <DataSpotlight :metric="crowdingControls.focusStat" />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DataSpotlight from "@/components/dashboard/DataSpotlight.vue";
import ControlPanel from "../../../components/dashboard/ControlPanel.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

const outcomeDropDown = {
  focusStat: {
    icon: "fas fa-poll",
    label: "What metric do you want to see?",
    values: [
      { name: "Cases", value: "cases" },
      { name: "Hospitalizations", value: "hospitalizations" },
      { name: "Vaccination", value: "vaccination" },
      { name: "Deaths", value: "deaths" },
    ],
  },
};

const outcomeControls = ref({
  focusStat: outcomeDropDown.focusStat.values[0],
});
useQueryParam({
  param: "outcome",
  ref: outcomeControls,
  refField: "focusStat",
  valid: (p) => outcomeDropDown.focusStat.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) =>
    outcomeDropDown.focusStat.values.find((v) => p === v.value),
});

const updateOutcomeControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    outcomeControls.value[k] = v;
  }
};

const crowdingDropDown = {
  focusStat: {
    icon: "fas fa-poll",
    label: "What metric do you want to see?",
    values: [
      { name: "Cases", value: "cases" },
      { name: "Hospitalizations", value: "hospitalizations" },
      { name: "Vaccination", value: "vaccination" },
      { name: "Deaths", value: "deaths" },
    ],
  },
};

const crowdingControls = ref({
  focusStat: crowdingDropDown.focusStat.values[0],
});
useQueryParam({
  param: "stat",
  ref: crowdingControls,
  refField: "focusStat",
  valid: (p) => crowdingDropDown.focusStat.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) =>
    crowdingDropDown.focusStat.values.find((v) => p === v.value),
});

const updateCrowdingControls = (newControls) => {
  for (const [k, v] of Object.entries(newControls)) {
    crowdingControls.value[k] = v;
  }
};
</script>

<style scoped lang="scss">
.centered {
  display: grid;
  place-content: center;
}
</style>
