<template>
  <ErrorPage v-if="errored" :message="errorMessage" @clear="errored = false" />
  <Suspense :key="$route.path">
    <slot />

    <template #fallback>
      <LoadingSpinner :loading="true" />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import ErrorPage from "@/components/base/ErrorPage.vue";
import LoadingSpinner from "@/components/base/LoadingSpinner.vue";

// ERROR HANDLING
const errored = ref(false);
const errorMessage = ref("");

onErrorCaptured((err: Error) => {
  console.warn(err);
  errored.value = true;
  errorMessage.value = err.message;

  return false; // prevent further bubbling up
});
</script>
