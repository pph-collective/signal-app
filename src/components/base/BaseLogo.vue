<template>
  <div class="logo">
    <img :src="imgSrc" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  inverted: {
    type: Boolean,
    default: false,
  },
});

const imgSrc = computed(() =>
  props.inverted
    ? "@/assets/images/signal-logo-inverted.png"
    : "@/assets/images/signal-logo.png"
);
</script>

<style lang="scss" scoped>
.logo {
  height: 3rem;
  width: 3rem;
}
</style>
