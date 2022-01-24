<template>
  <router-view />
</template>

<script setup lang="ts">
import { useFishStore } from "../../../store/fish";

const store = useFishStore();
await store.fetchBaseData();
</script>
