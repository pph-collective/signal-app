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
      <!-- add in outcomeData properly below -->
      <DataSpotlight
        :metric="controls.focusStat"
        :name-this="controls.nameThis"
        :data="data"
      />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DataSpotlight from "@/components/dashboard/DataSpotlight.vue";
import ControlPanel from "../../../components/dashboard/ControlPanel.vue";

import { useQueryParam } from "../../../composables/useQueryParam";
import { fetchHousingData } from "../../../utils/firebase";

const data = await fetchHousingData("housing_test"); // TODO change this to housing when uploaded

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
  nameThis: {
    icon: "fas fa-poll",
    label: "Lorem Ipsum",
    values: [
      { name: "Age Adjusted", value: "adjusted" },
      { name: "Age Specific", value: "specific" },
    ],
  },
};

const controls = ref({
  focusStat: dropDowns.focusStat.values[0],
  nameThis: dropDowns.nameThis.values[0],
});
useQueryParam({
  param: "stat",
  ref: controls,
  refField: "focusStat",
  valid: (p) => dropDowns.focusStat.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDowns.focusStat.values.find((v) => p === v.value),
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
