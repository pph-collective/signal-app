<template>
  <DashboardCard width="full">
    <template #subtitle>
      Where someone lives impacts their chances of getting sick with COVID-19.
      When a person gets sick with COVID-19, it can be hard to keep the other
      people they live with from getting sick if they don't have enough space to
      isolate. A lack of affordable housing means that many people don't have
      enough space at home. You can use this page to explore how housing
      impacted COVID-19 outcomes in Rhode Island.
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
        :age="controls.age"
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
import { fetchSpotlightData } from "../../../utils/firebase";

const props = defineProps<{
  datasetName: string;
}>();

const data = await fetchSpotlightData(props.datasetName);

const dropDowns = {
  age: {
    icon: "fas fa-poll",
    label: "What measure do you want to look at?",
    values: [
      { name: "Age Adjusted Rates", value: "adjusted" },
      { name: "By Age", value: "specific" },
    ],
  },
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
  age: dropDowns.age.values[0],
});

useQueryParam({
  param: "age",
  ref: controls,
  refField: "age",
  valid: (p) => dropDowns.age.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDowns.age.values.find((v) => p === v.value),
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
