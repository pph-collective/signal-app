<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from "vue";

import { buoyStores } from "../../../store/buoy";

const store = buoyStores["plankton"].useStore();
await store.fetchBaseData();

provide("store", store);
</script>
