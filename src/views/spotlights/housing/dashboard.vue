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
  <DashboardCard width="two-thirds">
    <template #content>
      <div>
        <GroupBarChart />
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="one-third">
    <template #content>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium
        tempor mi eget pellentesque. Etiam pharetra neque quis elit aliquam
        tristique. Donec at scelerisque nunc. Suspendisse malesuada erat non
        neque iaculis porttitor. Vestibulum egestas gravida sem, nec fermentum
        lacus sollicitudin non. Proin nunc mauris, porttitor ut ex vel, dapibus
        rutrum lacus. Aenean imperdiet, odio non accumsan consequat, enim mi
        vehicula arcu, ac porttitor urna dui vel tortor. Quisque ut nibh ut quam
        faucibus accumsan. Aenean mi elit, egestas a sem in, feugiat aliquet
        arcu.
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #subtitle>Buttons here?</template>
  </DashboardCard>
  <DashboardCard width="two-thirds">
    <template #content>
      <div>
        <GroupBarChart />
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="one-third">
    <template #content>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium
        tempor mi eget pellentesque. Etiam pharetra neque quis elit aliquam
        tristique. Donec at scelerisque nunc. Suspendisse malesuada erat non
        neque iaculis porttitor. Vestibulum egestas gravida sem, nec fermentum
        lacus sollicitudin non. Proin nunc mauris, porttitor ut ex vel, dapibus
        rutrum lacus. Aenean imperdiet, odio non accumsan consequat, enim mi
        vehicula arcu, ac porttitor urna dui vel tortor. Quisque ut nibh ut quam
        faucibus accumsan. Aenean mi elit, egestas a sem in, feugiat aliquet
        arcu.
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";
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
