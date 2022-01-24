<template>
  <DashboardCard width="one-third" :height="height">
    <template #title> {{ locationType }} Locations </template>
    <template #subtitle>
      Hover over the circles to find out the buoy locations.
    </template>
    <template #content>
      <Map
        id="map"
        :height="400"
        :dataset="coordinates"
        :enable-darkmode="false"
        :color-domain="colorDomain"
        :color-range="colorRange"
      />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";

import { Coordinate } from "../../utils/erddap";
import { useColorMap } from "../../store/colorMap";

import DashboardCard from "@/components/base/DashboardCard.vue";
import Map from "@/components/charts/BayMap.vue";

interface Props {
  coordinates: Coordinate[];
  height?: number;
  locationType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 2,
  locationType: "Buoy",
});

const colorMap = useColorMap();

const colorDomain = computed(() =>
  props.coordinates.map((v) => v.station_name)
);

const colorRange = computed(() =>
  colorDomain.value.map((v) => colorMap.colors[v])
);
</script>
