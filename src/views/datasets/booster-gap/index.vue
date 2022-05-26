<template>
  <a ref="scrollRef" class="scroll-anchor" />
  <SuspenseComponent :key="currentDate">
    <p v-if="currentDate === dates[0]" class="update-date">
      Data last updated {{ prettyDate(currentDate) }}
    </p>
    <p v-else class="update-date">
      Archived data from {{ prettyDate(currentDate) }} -
      <router-link :to="{ path, query: { ...route.query, date: dates[0] } }"
        >View latest data</router-link
      >
    </p>
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
import { useRoute } from "vue-router";

import Dashboard from "@/views/datasets/booster-gap/dashboard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

import { fetchKeys } from "../../../utils/firebase";
import { prettyDate } from "../../../utils/utils";

const datasetName = "vax_first_dose_coldspots";
// TODO: update dataset name

const dates = await fetchKeys(datasetName);
const currentDate = ref(dates[0]);
useQueryParam({
  ref: currentDate,
  param: "date",
  push: true,
  valid: (d) => dates.includes(d),
  resetFields: ["cluster", "zoom"],
});

const route = useRoute();
const { path } = route;

const scrollRef = ref(null);
const handleDateChange = (newDate) => {
  scrollRef.value.scrollIntoView({ behavior: "smooth" });
  currentDate.value = newDate;
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
