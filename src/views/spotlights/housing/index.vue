<template>
  <a ref="scrollRef" class="scroll-anchor" />
  <Dashboard :dataset-name="datasetName" />
</template>

<script setup lang="ts">
// import { ref } from "vue";
// import { useRoute } from "vue-router";

import Dashboard from "@/views/spotlights/housing/dashboard.vue";
// import SuspenseComponent from "@/components/base/SuspenseComponent.vue";

// import { useQueryParam } from "../../../composables/useQueryParam";

// import { fetchKeys } from "../../../utils/firebase";
// import { prettyDate } from "../../../utils/utils";

const datasetName = "housing_spotlight";

// const dates = await fetchKeys(datasetName);
// const currentDate = ref(dates[0])

// Use query params??

// const route = useRoute();
// const { path } = route;
</script>

<style scoped>
.scroll-anchor {
  position: absolute;
  top: -2rem;
}
</style>
