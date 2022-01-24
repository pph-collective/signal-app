<template>
  <DashboardCard width="two-thirds" :height="6">
    <template #title> Visualize Data </template>
    <template #subtitle>
      This plot shows
      {{ plottableVariables.map(formatVariable).join(", ") }} over the period
      between {{ query.startDate }} and {{ query.endDate }}. You can hover over
      the lines to see more specific data. Weather data from
      <a href="https://www.rcc-acis.org/" target="_blank" rel="noreferrer"
        >NOAA</a
      >
      is included below.
    </template>
    <template #content>
      <div
        v-if="compareDataset.length > 0"
        class="notification is-info is-light mx-4 px-4 py-2"
      >
        <i class="fas fa-info-circle mr-1" />
        <span class="is-size-6 mr-4">
          <a :href="`/dataset/${compareStore.name}`" target="_blank">{{
            compareStore.title
          }}</a>
          data is available which matches your query
        </span>
        <button class="button is-info is-small" @click="toggleCompare">
          {{ compareText }}
        </button>
      </div>

      <div
        v-if="nonPlottableVariables.length > 0"
        class="notification is-warning is-light mx-4 px-4 py-2"
      >
        <i class="fas fa-exclamation-circle mr-1" />
        <span class="is-size-6 mr-4">
          The following variables are not plottable, download the data below if
          needed: {{ nonPlottableVariables.map(formatVariable).join(", ") }}
        </span>
      </div>

      <div
        v-if="dataset.length === 0"
        class="notification is-danger is-light mx-4 px-4 py-2 has-text-centered"
      >
        <p><strong>No Data Matches the Query</strong></p>
      </div>

      <LineChart
        v-else
        id="line-chart"
        :dataset="dataset"
        :dataset-name="store.title"
        :dataset-line-width="store.lineWidth"
        :compare-dataset="compare ? compareDataset : []"
        :compare-name="compareStore.title"
        :compare-line-width="compareStore.lineWidth"
        :variables="plottableVariables"
        :color-domain="colorDomain"
        :color-range="colorRange"
        x="time"
        y="station_name"
        :weather-dataset="weather"
      />

      <p v-if="downsampled">
        <small
          ><i class="fas fa-info-circle mr-1" /><i>Note:</i> Data has been
          downsampled, select a smaller date range to visualize raw data.</small
        >
      </p>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";

import LineChart from "@/components/charts/LineChart.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";

import { formatVariable } from "../../utils/utils";

const props = defineProps({
  query: {
    type: Object,
    required: true,
  },
});

// comparison of other dataset
const compare = ref(false);
const compareText = ref("Add To Plot");

const toggleCompare = () => {
  compare.value = !compare.value;
  compareText.value = compare.value ? "Remove From Plot" : "Add to Plot";
};

// set up color domain and range for vega
import { useColorMap } from "../../store/colorMap";

const colorMap = useColorMap();
const colorDomain = computed(() =>
  props.query.coordinates.map((c) => c.station_name)
);

const colorRange = computed(() =>
  colorDomain.value.map((c) => colorMap.colors[c])
);

// split variables into plottable and non-plottable
const plottableVariables = computed(() =>
  props.query.variables.filter((v) => !v.name.endsWith("Qualifiers"))
);
const nonPlottableVariables = computed(() =>
  props.query.variables.filter((v) => v.name.endsWith("Qualifiers"))
);

// fetch the data
import { fetchWeather } from "../../utils/weather";
import { BuoyStore } from "../../store/buoy";

const compareStore = inject("compareStore") as BuoyStore;
const compareDataset = ref([]);

const store = inject("store") as BuoyStore;
const dataset = ref([]);
const downsampled = ref(false);

const weather = ref([]);

const fetchData = async () => {
  const { coordinates, startDate, endDate } = props.query;
  const query = {
    ids: coordinates.map((c) => c.buoyId),
    variables: plottableVariables.value.map((v) => v.name),
    start: startDate,
    end: endDate,
  };
  const res = await Promise.all([
    store.fetchBuoyData(query),
    compareStore.fetchBuoyData(query),
    fetchWeather({ startDate, endDate }),
  ]);
  dataset.value = res[0].data;
  downsampled.value = res[0].downsampled;
  compareDataset.value = res[1].data;
  weather.value = res[2];
};

await fetchData();
watch(
  () => ({ ...props.query }),
  () => {
    fetchData();
  }
);
</script>
