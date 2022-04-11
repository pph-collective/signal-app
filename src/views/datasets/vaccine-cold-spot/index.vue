<template>
  <DashboardCard width="full">
    <template #subtitle>
      This tool shows us places where fewer people are vaccinated compared to
      state levels. We call this difference in vaccinations a gap. Vaccines can
      keep us from getting very sick with COVID-19. You can use this information
      to find where the gaps are in our state and take steps to help close them.
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="1">
    <template #content>
      <ControlPanel :drop-downs="dropDowns" @selected="updateControls" />
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="5">
    <template #title>{{
      activeCluster.name
        ? `Community: ${activeCluster.name}`
        : "Select a community to explore"
    }}</template>

    <template #top-right>
      <button
        :disabled="!activeCluster.name"
        class="zoom-button button is-secondary is-light"
        @click="zoomed = !zoomed"
      >
        <span class="icon">
          <i
            class="fas fa-search-plus"
            :class="[zoomed ? 'fa-search-minus' : 'fa-search-plus']"
          ></i>
        </span>
        <span>{{
          zoomed ? "Zoom Back Out" : "Zoom to Selected Community"
        }}</span>
      </button>
    </template>

    <template #subtitle>
      This map shows where there are gaps in vaccination. [Darker areas show
      bigger gaps in vaccination among [selected group]]. Select a community,
      click the Zoom button, and scroll down to learn more.
    </template>

    <template #content>
      <div class="map-container">
        <ColdMap
          :geo="data.geo"
          :stats="data.stats"
          :filter-town="controls.town"
          :fill-stat="controls.fillStat"
          class="is-absolute"
          @new-active-cluster="activeCluster = $event"
        />
        <ClusterMap
          v-if="activeCluster && zoomed"
          :cluster="activeCluster"
          :geo="data.geo"
          :locations="data.locations"
          class="is-absolute"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half" :height="2">
    <template #title>Potential Barriers</template>
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <PotentialBarriers
          :barriers="data.barriers"
          :active-cluster="activeCluster"
        />
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard width="half" :height="2">
    <template #title>Gap by Race</template>
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <GapByRace :stats="data.stats" :active-cluster="activeCluster" />
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard width="full">
    <template #title>Moar Info</template>
    <template #subtitle>Details about the things</template>
    <template #content>
      <div class="px-4 content">
        <p>
          Cred etsy farm-to-table af, proident selfies forage. Hella est
          keffiyeh master cleanse, ad etsy venmo letterpress brooklyn fanny pack
          squid ut roof party. In 90's sriracha DIY, la croix ipsum 3 wolf moon
          gochujang dolore leggings raclette. You probably haven't heard of them
          gastropub labore hammock lomo jianbing gluten-free cold-pressed irony
          fam. Air plant ea adaptogen, ullamco austin excepteur meditation.
          Shaman vice flexitarian polaroid.
        </p>

        <p>
          Snackwave wolf gentrify deserunt iPhone pabst. Woke reprehenderit you
          probably haven't heard of them portland sint. Listicle pitchfork
          veniam PBRB try-hard disrupt salvia cornhole man bun incididunt.
          Adaptogen eiusmod fugiat air plant. Eiusmod tilde in celiac la croix.
          Pitchfork photo booth keffiyeh godard kitsch minim distillery.
        </p>

        <ul>
          <li><a href="/">One Link</a></li>
          <li><a href="/">Two Link</a></li>
          <li><a href="/" style="color: red">Red Link</a></li>
          <li><a href="/" style="color: blue">Blue Link</a></li>
        </ul>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import RI_GEOJSON from "@/assets/geography/ri.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import HiddenContent from "@/components/base/HiddenContent.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapByRace from "@/components/dashboard/GapByRace.vue";
import PotentialBarriers from "@/components/dashboard/PotentialBarriers.vue";

import { fetchKeys, fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";

const activeCluster = ref(NULL_CLUSTER);
const zoomed = ref(false);

const datasetName = "vax_first_dose_coldspots";
const dates = await fetchKeys(datasetName);
const data = ref(await fetchColdSpotData(datasetName, dates[0]));

const datesDropdownValues = dates.map((date) => {
  // Support for ISO 8601 formats differs in that date-only strings (e.g. "1970-01-01") are treated as UTC, not local.
  // This hack, sets the time to the start of the day such that we get back the day we specified in the yyyy-mm-dd
  // https://stackoverflow.com/questions/48351987/create-javascript-date-object-from-string-yyyy-mm-dd-in-local-timezone
  const dateString = new Date(`${date} 00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return { name: dateString, value: date };
});

const townDefault = "All of Rhode Island";
const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const dropDowns = computed(() => {
  return {
    town: {
      icon: "fas fa-globe",
      label: "Where do you want to look?",
      values: [townDefault, ...towns],
    },
    fillStat: {
      label: "Which group do you want to focus on?",
      icon: "fas fa-fill-drip",
      values: [
        { name: "None", value: "", tooltip: "" },
        { name: "All residents", value: "gap_total_pct", tooltip: "gap_total" },
        {
          name: "White residents",
          value: "gap_white_pct",
          tooltip: "gap_white",
        },
        {
          name: "Black residents",
          value: "gap_black_pct",
          tooltip: "gap_black",
        },
        {
          name: "Latino residents",
          value: "gap_latino_pct",
          tooltip: "gap_latino",
        },
        {
          name: "Asian residents",
          value: "gap_asian_pct",
          tooltip: "gap_asian",
        },
      ],
    },
    date: {
      icon: "fas fa-calendar-alt",
      label: "When are you interested in?",
      values: datesDropdownValues,
    },
  };
});

const controls = ref({
  fillStat: dropDowns.value.fillStat.values[0],
  date: datesDropdownValues[0],
  town: townDefault,
});
const updateControls = (newControls) => {
  // TODO: make sure this makes the spinner spin
  if (newControls.date !== controls.value.date.value) {
    fetchColdSpotData(datasetName, newControls.date.value).then((res) => {
      data.value = res;
    });
  }

  // update the control selections
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};
</script>

<style scoped>
.map-container {
  max-width: min(1280px, 95vw);
  height: max(300px, 75vh);
  max-height: 1280px;
  position: relative;
  margin: auto;
}

.zoom-button {
  white-space: nowrap;
  min-width: 12rem; /* 192 px */
}

.is-absolute {
  position: absolute;
}
</style>
