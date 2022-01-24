<template>
  <BuoyDashboard :scenarios="scenarios">
    <template #available-data>
      Narragansett Bay Long-Term Plankton Time Series is one of the world’s
      longest-running plankton surveys. Beginning in 1957, weekly samples have
      been collected to assess the phytoplankton community and characterize the
      physical parameters of Narragansett Bay. The heatmap below summarizes the
      number of observations collected for each month for different variables.
      Use this heatmap to help you decide what data you want to visualize or
      download. When you have an idea, go ahead and select the variables and
      dates to explore. Or download the data in the most appropriate format for
      your analyses!
    </template>

    <template #heatmap>
      <VariableHeatmap :summary="store.summary" :variables="store.variables" />
    </template>

    <template #learn-more>
      <p>
        The historical data available on this site has been compiled from the
        <a href="https://web.uri.edu/plankton/">Narragansett Bay Time Series</a>
        and <a href="http://www.nabats.org/">NABATS.org</a>.
      </p>
      <p>
        <strong>To cite this data</strong>:
        <a href="https://web.uri.edu/gso/research/plankton/data/"
          >Plankton Time Data Page</a
        >, and for data prior to 1999: please honor the contributions of Prof.
        Smayda by properly citing the 1959 to 1997 NABATS data as: "Smayda, T.J.
        &amp; the Bunker C community (1959-1997). Narragansett Bay Plankton Time
        Series. Graduate School of Oceanography, URI. Data available at:
        <a href="http://www.nabats.org/">NABATS.org</a>"
      </p>
    </template>
  </BuoyDashboard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import VariableHeatmap from "@/components/buoy/VariableHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

import { BuoyStore } from "../../../store/buoy";
const store = inject("store") as BuoyStore;

const scenarios = [
  {
    name: "Water Temperature, 2017-2018",
    query: {
      ids: "bid21",
      variables: "WaterTempSurface,WaterTempBottom",
      start: "2017-01-01",
      end: "2018-12-31",
    },
  },
  {
    name: "Silica, 2003-2009",
    query: {
      ids: "bid21",
      variables: "SilicaBottom,SilicaSurface",
      start: "2003-01-01",
      end: "2009-12-31",
    },
  },
];
</script>
