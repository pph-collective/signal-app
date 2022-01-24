<template>
  <main class="error-container">
    <div class="error-content">
      <i class="fas fa-life-ring mr-2 has-text-danger" />
      <p>{{ message }}</p>
    </div>
    <a @click="goBack">
      <i class="fas fa-arrow-left mr-2" />
      Back
    </a>
    <router-link to="/" @click="emit('clear')">
      <i class="fas fa-home mr-2" />
      Home
    </router-link>
  </main>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["clear"]);

import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  emit("clear");
  router.back();
};
</script>

<style lang="scss" scoped>
.error-content,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-container {
  padding: 3rem;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: white;
}
.error-content {
  font-size: 3rem;
}
</style>
