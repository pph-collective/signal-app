<template>
  <span :class="[forceShow || 'visually-hidden']">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const forceShow = ref(false);

if (import.meta.env.DEV) {
  const handleKeyDown = (ev) => {
    if (ev.key === "Alt") {
      forceShow.value = true;
    }
  };
  const handleKeyUp = (ev) => {
    if (ev.key === "Alt") {
      forceShow.value = false;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  });
}
</script>

<style scoped>
.visually-hidden {
  display: inline-block;
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1;
  width: 1;
  margin: -1;
  padding: 0;
  border: 0;
}
</style>
