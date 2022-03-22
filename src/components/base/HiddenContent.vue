<template>
  <div class="content-container">
    <div :style="{ visibility: show ? 'visible' : 'hidden' }">
      <slot></slot>
    </div>
    <div v-if="!show" class="message">
      <p>Select a cold spot on the map to learn more</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
</script>

<style lang="scss" scoped>
.content-container {
  position: relative;
  height: 100%;
}

.message {
  display: grid;
  width: 100%;
  height: 100%;
  padding: 1rem;
  place-content: center;
  grid-template-areas: ".";
  position: absolute;
  top: 0;
  background-color: white;

  p {
    font-style: italic;
    text-align: center;
    filter: brightness(185%);
  }
}
</style>
