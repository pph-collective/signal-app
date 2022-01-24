<template>
  <div class="slider-container">
    <label class="x-axis" for="slider"></label>
    <input
      id="slider"
      v-model="value"
      class="slider mb-2"
      step="1"
      min="0"
      :max="store.dateLength - 1"
      type="range"
      @input="changeDate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { scaleTime } from "d3-scale";
import { select } from "d3-selection";
import { axisBottom } from "d3-axis";

import { useDAStore } from "../../store/domoic-acid";
const store = useDAStore();

const value = ref(0);
const timeout = ref(null);

const updatedDate = computed(() => {
  const selectedDate = new Date(
    store.startDate.valueOf() + value.value * 1000 * 60 * 60 * 24
  );

  return store.dates.find((d) => d >= selectedDate);
});

const domainArray = computed(() => [store.startDate, store.endDate]);

const generateAxis = () => {
  try {
    // remove the old axis if it exists
    select(".x-axis svg").remove();
  } catch {}
  const svg = select(".x-axis").append("svg").attr("width", "calc(100%)");
  const scale = scaleTime()
    .domain(domainArray.value)
    .range([0, svg.node().getBoundingClientRect().width - 40]);
  const xAxis = axisBottom()
    .scale(scale)
    .ticks(Math.round(svg.node().getBoundingClientRect().width / 100));
  svg.append("g").attr("transform", "translate(20, 20)").call(xAxis);
};

const changeDate = () => {
  store.selectedDate = updatedDate.value;
};

const onResize = () => {
  // debounce re-drawing axis
  if (timeout.value) clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    generateAxis();
  }, 300);
};

onMounted(() => {
  generateAxis();
  window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => window.removeEventListener("resize", onResize));
</script>

<style lang="scss" scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: rgba(355, 355, 355, 0.7);
  z-index: 2;
  width: 95%;
  margin: auto;
  height: 70px;
  bottom: 30px;
  left: 2.5%;
}
.x-axis {
  z-index: 1000;
  height: 0;
  font-weight: 600;
  stroke-width: 1.5px;
}
input[type="range"].slider {
  margin-left: 20px;
  bottom: 0px;
  position: absolute;
  z-index: 1000;
  width: calc(100% - 40px);
}
</style>
