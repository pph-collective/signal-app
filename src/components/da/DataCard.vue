<template>
  <div class="data-card card-content content is-hidden-mobile">
    <div
      v-for="(item, index) in store.activeCoordinates"
      :key="index"
      class="data-card-item"
    >
      <h6 class="mb-0">{{ item.station_name }}</h6>
      <p class="mb-0 is-size-7-half">
        {{ sampleText(item.station_name) }}
      </p>
      <svg height="10" :width="280 - 20 * 2">
        <rect
          :width="
            Math.max(0, sampleNormDA(item.station_name) * (280 - 20 * 2) + 2)
          "
          height="10"
          :style="'fill:' + sampleColor(item.station_name)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDAStore } from "../../store/domoic-acid";
const store = useDAStore();

const sampleText = (site) => {
  const match = store.selectedSamples.find((s) => s.station_name === site);
  if (match !== undefined) {
    return match === 0
      ? "DA not detected"
      : `${parseInt(match.pDA)}ng of DA / L of seawater`;
  } else {
    return "No sample";
  }
};

const sampleColor = (site) =>
  store.selectedSamples.find(({ station_name }) => station_name === site)
    ?.color ?? "white";

const sampleNormDA = (site) =>
  store.selectedSamples.find(({ station_name }) => station_name === site)
    ?.normDA ?? -1;
</script>

<style lang="scss" scoped>
.data-card {
  z-index: 10000;
  position: absolute;
  background-color: white;
  width: 280px;
  margin: 20px;
  border-radius: 1rem;
  box-shadow: 3px 3px rgba(1, 1, 1, 0.1);
}
.is-size-7-half {
  font-size: 0.85rem;
}
svg {
  display: block;
  margin-bottom: 10px;
}
</style>
