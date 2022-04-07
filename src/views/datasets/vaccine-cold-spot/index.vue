<template>
  <a ref="scrollRef" class="scroll-anchor" />
  <SuspenseComponent :key="currentDate">
    <p class="update-date">Data last updated: {{ prettyDate(currentDate) }}</p>
    <div class="vertical-spacing" />
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
import { prettyDate } from "../../../utils/utils";

const datasetName = "vax_first_dose_coldspots";

const dates = await fetchKeys(datasetName);
const currentDate = ref(dates[0]);

const scrollRef = ref(null);
const handleDateChange = (newDate) => {
  currentDate.value = newDate;
  scrollRef.value.scrollIntoView({ smooth: true });
};
</script>

<style scoped>
.update-date {
  position: absolute;
  top: 0.4rem;
  right: 1rem;
  font-size: 0.825rem;
  font-style: italic;
}

.scroll-anchor {
  position: absolute;
  top: -2rem;
}

.vertical-spacing {
  height: 0.1rem;
}
</style>
