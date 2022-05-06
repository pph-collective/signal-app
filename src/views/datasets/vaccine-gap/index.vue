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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Dashboard from "@/views/datasets/vaccine-gap/dashboard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

import { fetchKeys } from "../../../utils/firebase";
import { prettyDate } from "../../../utils/utils";

const datasetName = "vax_first_dose_coldspots";
const route = useRoute();
const { path } = route;
const router = useRouter();

const dates = await fetchKeys(datasetName);
let initDate = dates[0];
if (route.query.date) {
  if (!dates.includes(route.query.date as string)) {
    throw new Error(`No dataset available on date ${route.query.date}`);
  }
  initDate = route.query.date as string;
} else {
  router.replace({ path, query: { ...route.query, date: initDate } });
}
const currentDate = ref(initDate);

watch(currentDate, () =>
  router.push({ path, query: { ...route.query, date: currentDate.value } })
);
watch(
  () => route.query,
  () => {
    if (route.query.date !== currentDate.value) {
      currentDate.value = route.query.date as string;
    }
  }
);

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
