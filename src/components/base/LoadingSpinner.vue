<template>
  <div v-if="loading" class="loading-container">
    <i spin class="loading-icon fas fa-anchor" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.loading-container {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(desaturate(lighten($primary, 10%), 10%), 0.5);
  z-index: 1000;
  justify-content: center;
}

.loading-icon {
  align-self: center;
  font-size: 15rem;
  color: $primary;
  animation-name: spin;
  animation-duration: 2500ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
