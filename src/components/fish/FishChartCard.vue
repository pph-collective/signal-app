<template>
  <DashboardCard width="two-thirds" :height="5">
    <template #title>{{ species }}</template>
    <template #content>
      <div v-if="info.sciName" class="message is-info is-light mx-4">
        <div class="message-header">
          <p>Species Info</p>
          <a
            v-if="info.href"
            :href="info.href"
            class="is-size-7 has-text-weight-light"
            >Source: FishBase</a
          >
        </div>
        <div class="message-body">
          <figure v-if="info.photoUrl" class="image is-128x128 fish-image">
            <img :src="info.photoUrl" :alt="'Photo of ' + species" />
          </figure>
          <div>
            <p><strong>Scientific Name:</strong> {{ info.sciName }}</p>
            <p v-if="info.sectionData">
              <strong>IUCN Status:</strong> {{ info.sectionData.IUCN }}
            </p>
            <p v-if="info.sectionData">
              <strong>Classification:</strong>
              {{ info.sectionData.Classification.Classification }}
            </p>
          </div>
        </div>
      </div>
      <FishLineChart
        id="line-chart"
        :dataset="data"
        :stations="store.stations"
        :color-range="colorRange"
      />
      <FishTempsCharts
        id="temps-charts"
        :dataset="store.temps"
        :stations="store.stations"
        :color-range="colorRange"
      />
      <p>
        <small
          ><strong>Surface Δ °C from Mean:</strong> The mean water surface
          temperature of the given month (e.g. January 1970) minus the mean
          water surface temperature for the month (e.g. January) in all years in
          the dataset.</small
        >
      </p>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import FishLineChart from "@/components/fish/FishLineChart.vue";
import FishTempsCharts from "@/components/fish/FishTempsCharts.vue";

const props = defineProps({
  species: {
    type: String,
    required: true,
  },
});

import { useFishStore, Info } from "../../store/fish";
const store = useFishStore();

const data = computed(() =>
  store.samples.filter(({ title }) => title === props.species)
);
const info = ref<Info>({});

const fetchInfo = async () => {
  info.value = await store.fetchInfo(props.species);
};

await fetchInfo();
watch(() => props.species, fetchInfo);

// set up color range
import { useColorMap } from "../../store/colorMap";

const colorMap = useColorMap();

const colorRange = computed(() =>
  store.stations.map((v) => colorMap.colors[v])
);
</script>

<style lang="scss" scoped>
.fish-image {
  float: right;
}
</style>
