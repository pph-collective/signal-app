<script setup lang="ts">
import DefaultLayout from "@/layouts/default.vue";
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>

  <!-- diagonal hash pattern for map -->
  <div class="svg-container">
    <svg height="0" width="0">
      <defs>
        <pattern
          id="diagonalHatch"
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
          patternTransform="rotate(-45 4 4)"
        >
          <path d="M -1,2 l 10,0" stroke="#bbbbbb" stroke-width="3" />
        </pattern>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss">
.svg-container {
  height: 0px;
}
</style>
