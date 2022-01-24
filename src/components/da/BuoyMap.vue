<template>
  <div class="mapboxgl-map-container">
    <div class="date is-hidden-touch">
      <span>{{ formattedDate }}</span>
    </div>
    <div class="date-mobile is-hidden-desktop">
      <span>{{ formattedDate }}</span>
    </div>
    <div ref="el" class="mapbox-container" />
  </div>

  <!-- reference image for mapbox to pull from -->
  <img
    ref="imageEl"
    :src="BuoyMarker"
    style="
      visibility: hidden;
      height: 15px;
      width: 15px;
      position: absolute;
      top: 0;
    "
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";

import BuoyMarker from "@/assets/illustrations/buoy-marker.svg";

import { useDAStore } from "../../store/domoic-acid";
const store = useDAStore();

const el = ref<HTMLDivElement>(null);
const imageEl = ref<HTMLImageElement>(null);
const map = ref(null);
onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  map.value = new mapboxgl.Map({
    container: el.value,
    style: "mapbox://styles/ccv-bot/ckmxra8oi0rsw17mzcbqrktzi",
    center: [-71.46, 41.5],
    zoom: 9,
    doubleClickZoom: false,
    scrollZoom: false,
  });

  const geoJSON = {
    type: "geojson",
    data: {
      id: "buoy",
      type: "FeatureCollection",
      features: store.activeCoordinates.map(({ latitude, longitude }) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        };
      }),
    },
  };

  map.value.on("load", function () {
    map.value.resize();
    map.value.addImage("buoy-marker", imageEl.value);

    map.value.addSource("points", geoJSON);

    map.value.addLayer({
      id: "points",
      type: "symbol",
      source: "points",
      layout: {
        "icon-allow-overlap": true,
        "icon-image": "buoy-marker",
        "icon-offset": [0.5, -7], // optically centered
      },
    });

    updateMarkers();
  });
});

let markers = [];
const updateMarkers = () => {
  markers.forEach((marker) => {
    marker._element.remove();
    marker.remove();
  });
  markers = [];

  store.selectedSamples.forEach(({ color, size, station_name }) => {
    // create circle elements to display
    const elementSize = `${100 * size}px`;
    const el = document.createElement("div");
    el.className = "marker";
    el.style.width = elementSize;
    el.style.height = elementSize;
    el.style.backgroundColor = color;
    el.style.opacity = "0.8";
    el.style.borderRadius = "100%";

    markers.push(
      new mapboxgl.Marker({ element: el })
        .setLngLat(store.siteCoordinates(station_name))
        .setPopup(new mapboxgl.Popup().setText(station_name))
        .addTo(map.value)
    );
  });
};

watch(() => store.selectedDate, updateMarkers);

const formattedDate = computed(() =>
  store.selectedDate.toLocaleDateString("sv")
);
</script>

<style lang="scss" scoped>
.mapboxgl-map-container {
  height: 70vh;
  width: 100%;
  position: relative;
}
.date {
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2rem;
  position: absolute;
  text-align: right;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;
}
.date-mobile {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem;
  position: absolute;
  text-align: right;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;
}
.mapbox-container {
  height: 100%;
}
</style>

<style lang="scss">
.mapboxgl-marker {
  height: 1.2rem;
  path {
    fill: hsla(0deg, 0%, 20%, 80%);
  }
}
</style>
