<template>
  <a ref="scrollRef" />
  <SuspenseComponent :key="currentDate">
    <Dashboard
      :dataset-name="datasetName"
      :dates="dates"
      :current-date="currentDate"
      @new-date="handleDateChange"
    />
  </SuspenseComponent>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Dashboard from "@/views/datasets/vaccine-cold-spot/dashboard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

import { fetchKeys } from "../../../utils/firebase";

const datasetName = "vax_first_dose_coldspots";

const dates = await fetchKeys(datasetName);
const currentDate = ref(dates[0]);

const scrollRef = ref(null);
const handleDateChange = (newDate) => {
  currentDate.value = newDate;
  scrollHere.value.scrollIntoView({ smooth: true });
};
</script>
