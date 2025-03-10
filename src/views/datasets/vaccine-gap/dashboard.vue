<template>
  <DashboardCard width="full">
    <template #subtitle>
      This tool, which is no longer being updated, shows us places where fewer people received a
      COVID-19 vaccine dose compared to state levels. We call this difference in
      vaccinations a <em>gap</em>. Annual COVID-19 vaccines can keep us from getting very sick
      with COVID-19. You can use this information to find where the gaps were in
      our state and take steps to minimize gaps with the annual COVID-19 vaccines.
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="1">
    <template #content>
      <ControlPanel
        :drop-downs="dropDowns"
        :init-value="controls"
        @selected="updateControls"
      />
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
        class="zoom-button button is-link"
        @click="zoomed = !zoomed"
      >
        <span class="icon">
          <i
            class="fas"
            :class="[zoomed ? 'fa-search-minus' : 'fa-search-plus']"
          ></i>
        </span>
        <span>{{
          zoomed ? "Zoom Back Out" : "Zoom to Selected Community"
        }}</span>
      </button>
    </template>

    <template #subtitle>
      This map shows where there were gaps in COVID-19 vaccines. Darker areas
      show bigger gaps in vaccination among
      <strong>{{ controls.focusStat.name }}</strong
      >. Areas with dashes mean there is not enough information. Select a
      community, click the <em>Zoom to Community</em> button, and scroll down to
      learn more.
    </template>

    <template #content>
      <div class="map-container">
        <ColdMap
          :geo="data.geo"
          :stats="data.stats"
          :filter-town="controls.town"
          :focus-stat="controls.focusStat"
          :initial-active-cluster="dashboardActiveCluster"
          :map-type="'cold'"
          class="is-absolute"
          :display-as-rate="false"
          @new-active-cluster-id="updateCluster"
        />
        <ClusterMap
          v-if="activeCluster && zoomed"
          :cluster="activeCluster"
          :geo="data.geo"
          :locations="data.locations"
          class="is-absolute"
        />
        <div v-if="activeCluster && zoomed" class="instructions">
          <p>
            A <RedDot class="red-dot" /> indicates a previous vaccination clinic
          </p>
        </div>
      </div>
      <div :class="{ invisible: activeCluster.name === '' }">
        <router-link
          :to="`/dataset/vaccine-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#chart`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard id="chart" width="full" :height="2">
    <template #title
      >What communities had the largest vaccine gaps?</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <GapByRace
          :stats="data.stats"
          :active-cluster="activeCluster"
          :field-names="[
            { field: 'asian', name: 'Asian' },
            { field: 'black', name: 'Black' },
            { field: 'latino', name: 'Latino' },
            { field: 'white', name: 'White' },
            { field: 'total', name: 'All Residents' },
          ]"
          :focus-stat="controls.focusStat"
          :phrases="phrases"
          :display-as-rate="false"
        />
        <div :class="{ invisible: activeCluster.name === '' }">
          <router-link
            :to="`/dataset/vaccine-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#barriers`"
          >
            <i class="fa fa-arrow-circle-down fa-2x centered" />
          </router-link>
        </div>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="barriers" width="full" :height="2">
    <template #title>How do we reach people who need the annual vaccine?</template>
    <template #subtitle
      >People with fewer resources have a harder time getting
      vaccinated.</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <PotentialBarriers
          :barriers="data.barriers"
          :state-barriers="data.state_barriers"
          :active-cluster="activeCluster"
        />
        <router-link
          :to="`/dataset/vaccine-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#resources`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="resources" width="full">
    <template #title>What can I do to minimize the gap in the future?</template>
    <template #content>
      <VaccineResources />
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="2">
    <template #subtitle>Data Notes</template>
    <template #content>
      <div class="px-4 content">
        <DataNotes />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="1">
    <template #content>
      <ChooseDate
        :drop-down="dates"
        :init-value="dateControls"
        @new-date="updateDate"
      />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import RI_GEOJSON from "@/assets/geography/ri.json";
import HEZ_GEOJSON from "@/assets/geography/hez.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import HiddenContent from "@/components/base/HiddenContent.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapByRace from "@/components/dashboard/GapByRace.vue";
import PotentialBarriers from "@/components/dashboard/PotentialBarriers.vue";
import RedDot from "@/components/dashboard/RedDot.vue";
import DataNotes from "@/components/dashboard/DataNotes.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

import { fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";
import VaccineResources from "../../../components/dashboard/VaccineResources.vue";
import ChooseDate from "../../../components/dashboard/ChooseDate.vue";

const zoomed = ref(false);
useQueryParam({
  param: "zoom",
  ref: zoomed,
  valid: (p) => ["true", "false"].includes(p),
  valToParam: (v) => v.toString(),
  paramToVal: (p) => p === "true",
});

const props = defineProps<{
  dates: string[];
  currentDate: string;
  datasetName: string;
}>();

// fetch the data
const data = await fetchColdSpotData(props.datasetName, props.currentDate);

const clusterIdToCluster = (id) => {
  if (id === NULL_CLUSTER.cluster_id) {
    return NULL_CLUSTER;
  } else {
    const { name, cluster_id } =
      data.stats.find((s) => s.cluster_id === id) ?? NULL_CLUSTER;
    return { name, cluster_id };
  }
};

const activeCluster = ref(NULL_CLUSTER);
useQueryParam({
  param: "cluster",
  ref: activeCluster,
  valid: (id) =>
    id === NULL_CLUSTER.cluster_id ||
    data.stats.some((s) => s.cluster_id === id),
  convertInt: true,
  paramToVal: clusterIdToCluster,
  valToParam: (cluster) => cluster.cluster_id,
});
const dashboardActiveCluster = ref(activeCluster.value);

const dateControls = ref(props.currentDate ?? props.dates[0]);

const emit = defineEmits(["newDate"]);
watch(
  () => dateControls,
  (item) => {
    emit("newDate", item.value);
  },
  { deep: true },
);

const updateDate = (newDate) => {
  dateControls.value = newDate;
};

const townDefault = "All of Rhode Island";
const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const hez = HEZ_GEOJSON.map((geo) => geo.properties.HEZ).sort();
const dropDowns = {
  town: {
    icon: "fas fa-globe",
    label: "Where do you want to look?",
    values: [townDefault, "--Health Equity Zone", ...hez, "--Towns", ...towns],
  },
  focusStat: {
    label: "Which group do you want to focus on?",
    icon: "fas fa-fill-drip",
    values: [
      { name: "All Residents", value: "total" },
      { name: "White Residents", value: "white" },
      { name: "Black Residents", value: "black" },
      { name: "Latino Residents", value: "latino" },
      { name: "Asian Residents", value: "asian" },
    ],
  },
};

const controls = ref({
  focusStat: dropDowns.focusStat.values[0],
  town: townDefault,
});
useQueryParam({
  param: "stat",
  ref: controls,
  refField: "focusStat",
  valid: (p) => dropDowns.focusStat.values.some((v) => p === v.value),
  valToParam: (v) => v.value,
  paramToVal: (p) => dropDowns.focusStat.values.find((v) => p === v.value),
});
useQueryParam({
  param: "town",
  ref: controls,
  refField: "town",
  valid: (p) => dropDowns.town.values.some((v) => p === v),
  resetFields: ["cluster", "zoom"],
});

const updateControls = (newControls) => {
  // zoom back out, selections don't make sense with zoom in
  if (zoomed.value) {
    zoomed.value = false;
  }

  // new town selected, unselect active cluster
  if (newControls.town !== controls.value.town) {
    // activeCluster gets reset through useQueryParam, therefore we just need to update dashboardActiveCluster
    dashboardActiveCluster.value = NULL_CLUSTER;
  }

  // update the control selections
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};

const updateCluster = (newClusterId) => {
  activeCluster.value = clusterIdToCluster(newClusterId);
  dashboardActiveCluster.value = activeCluster.value;
};

const phrases = {
  gap: "In {{ name }}, <strong>{{ pct }}</strong> of {{ race }} residents were vaccinated compared to our goal of {{ expectedPct }} total vaccinations statewide. Approximately <strong>{{ gap }} more {{ minRaceName }} residents</strong> needed to be vaccinated to close this gap.",
  allResidents:
    "In {{ name }}, the largest gap was among {{ minRaceName }} residents. Only <strong>{{ pct }} of {{ name }} residents</strong> were vaccinated compared to {{ expectedPct }} statewide. Approximately <strong>{{ gap }} more {{ minRaceName }} residents</strong> needed to receive a dose to close this gap.",
  noGap:
    "In {{ name }}, <strong>{{ pct }}</strong> of {{ race }} residents were vaccinated compared to our goal of {{ expectedPct }} total vaccinations statewide.",
  noInfo:
    "In {{ name }}, there wasn't enough vaccine data on <strong>{{ race }} residents</strong> to determine their vaccination status or the number of vaccine doses that were needed to close the gap.",
  highest:
    "The largest gap was among <strong>{{ minRaceName }} residents</strong>. Only <strong>{{ pct }}</strong> of {{ minRaceName }} residents were vaccinated. Approximately <strong>{{ gap }}</strong> more {{ minRaceName }} residents needed to be vaccinated to close this gap.",
  kpiTitle: "{{ race }} residents vaccinated in {{ name }}",
  gapKpiTitle:
    "Approximate vaccine doses for {{ race }} residents needed to close the gap",
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

.has-flex-gap {
  gap: 1rem;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.instructions {
  position: absolute;
  top: 0;
  padding: 4px 4px;
  margin: 6px 6px 0px;
  background-color: hsl(0deg 0% 100% / 60%);
  font-size: 0.875rem;
  animation: fade-in 500ms ease-in-out both;
  animation-delay: 250ms;
}

.red-dot {
  margin-bottom: -5px;
}

.centered {
  display: grid;
  place-content: center;
}

.invisible {
  visibility: hidden;
}
</style>
