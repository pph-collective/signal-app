<template>
  <DashboardCard width="full">
    <template #subtitle>
      This tool, which is no longer being updated, shows us places where fewer tests were taken for COVID-19
      compared to state levels. We call this difference in in the number of tests a
      <em>gap</em>. Testing is an important first step in stopping the spread of
      COVID-19 so that people can stay home when they get a positive result. You
      can use this information to find where the gaps were in our state.
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
      This map shows where there were gaps in COVID-19 testing. Darker areas show
      bigger gaps in testing among
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
          :display-as-rate="true"
          @new-active-cluster-id="updateCluster"
        />
        <ClusterMap
          v-if="activeCluster && zoomed"
          :cluster="activeCluster"
          :geo="data.geo"
          :locations="[]"
          class="is-absolute"
        />
      </div>
      <div :class="{ invisible: activeCluster.name === '' }">
        <router-link
          :to="`/historical/testing-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#chart`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </div>
    </template>
  </DashboardCard>
  <DashboardCard id="chart" width="full" :height="2">
    <template #title>How many tests could have closed the gap?</template>
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
          :display-as-rate="true"
        />
        <div :class="{ invisible: activeCluster.name === '' }">
          <router-link
            :to="`/historical/testing-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#barriers`"
          >
            <i class="fa fa-arrow-circle-down fa-2x centered" />
          </router-link>
        </div>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="barriers" width="full" :height="2">
    <template #title>How do we reach people who need tests?</template>
    <template #subtitle
      >People with fewer resources have a harder time getting tested.</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <PotentialBarriers
          :barriers="data.barriers"
          :state-barriers="data.state_barriers"
          :active-cluster="activeCluster"
        />
        <router-link
          :to="`/historical/testing-gap?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#resources`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="resources" width="full">
    <template #title>What can I do to close testing gaps?</template>
    <template #content>
      <div>
        <div class="px-4 content">
          <h5>Make sure people know where to get tested for COVID-19</h5>
          <ul>
            <li>
              Find places to 
              <ExternalLink href="https://testinglocator.cdc.gov/"
                >get free COVID-19 testing near you.</ExternalLink>
            </li>
            <li>
              Use a  
              <ExternalLink href="https://www.cdc.gov/coronavirus/2019-ncov/testing/self-testing.html"
                >rapid COVID-19 test to test at home.</ExternalLink>
            </li>
          </ul>
          <h5>
            Make sure people know where to go to get treatment for COVID-19
          </h5>
          <ul>
            <li>
              Learn about 
              <ExternalLink
                href="https://covid.ri.gov/treat/therapeutics?gclid=CjwKCAjwpayjBhAnEiwA-7ena53D2cKyXNp0MgIbBXPPz27355gBrR3UTplmWLarJHLRR3ZBFM_aJBoCMgwQAvD_BwE"
                >treatments available for COVID-19</ExternalLink
              >
              available for COVID-19
            </li>
            <li>
              Find out where you can
              <ExternalLink
                href="https://covid-19-test-to-treat-locator-dhhs.hub.arcgis.com/"
                >find treatment in your neighborhood NEEDS LINK</ExternalLink
              >
            </li>
          </ul>
          <h5>Make sure people know where to go to get COVID-19 vaccines:</h5>
          <ul>
            <li>
              Visit our pages about COVID-19
              <router-link class="is-link" to="/dataset/vaccine-gap"
                >Vaccines
              </router-link>
              and
              <router-link class="is-link" to="/dataset/booster-gap"
                >Boosters
              </router-link>
              to learn more about where there are gaps in our state.
            </li>
            <li>
              Find COVID vaccines near you by using the search bar at
              <ExternalLink href="https://www.vaccines.gov/"
                >vaccines.gov</ExternalLink
              >. You can search by zip code or vaccine type
            </li>
            <li>
              You can also let people know
              <ExternalLink href="https://covid.ri.gov/vaccination#athome">
                how to get vaccinated at home </ExternalLink
              >. This is a good option for people who may have a harder time
              accessing a clinic.
            </li>
          </ul>
          <h5>
            Make sure people know how to keep their health insurance coverage
          </h5>
          <ul>
            <li>
              You can use this
              <ExternalLink
                href="https://staycovered.ri.gov/community-support/community-advocate-forum"
                >community advocate toolkit</ExternalLink
              >
              to help people learn about Medicaid renewals
            </li>
            <li>
              You can help people find health insurance
              through
              <ExternalLink href="https://healthsourceri.com/transitions/"
                >HealthSourceRI</ExternalLink
              >
            </li>
          </ul>
        </div>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="2">
    <template #subtitle>Data Notes</template>
    <template #content>
      <div class="is-size-7">
        This web tool includes information on tests administered to Rhode Island
        residents that were processed by the state laboratory at the Rhode
        Island Department of Health. Rhode Island residents with invalid or
        incomplete residential address information excluded. Data for Rhode
        Island residents who tested via at-home rapid tests are not included
        unless they submitted their results to the Rhode Island Department of
        Health. Estimates of population size are sourced from the United States
        Census Bureau's
        <ExternalLink href="https://www.census.gov/programs-surveys/acs"
          >American Community Survey</ExternalLink
        >
        (2016-2020, 5-year estimates). There is statistical uncertainty
        associated with these estimates, particularly for small populations in
        small geographic areas, resulting in estimates of testing rates that are
        unreliable. Some estimates may be suppressed in line with the Rhode
        Island Department of Health's
        <ExternalLink
          href="https://health.ri.gov/publications/policies/SmallNumbersReporting.pdf"
          >Small Numbers Reporting Policy</ExternalLink
        >.
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
import ExternalLink from "@/components/base/ExternalLink.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

import { fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";
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

// setup phrases for card text
const phrases = {
  gap: "In {{ name }}, <strong>{{ rate }}</strong> per 100,000 {{ race }} residents got tested compared to our goal of {{ expectedRate }} total tests statewide. Approximately <strong>{{ gap }} more {{ minRaceName }} residents</strong> need to be tested to close this gap.",
  allResidents:
    "In {{ name }}, the largest gap was among {{ minRaceName }} residents. Only <strong>{{ rate }} per 100,000 {{ name }} residents</strong> were tested compared to {{ expectedRate }} per 100,000 statewide. Approximately <strong>{{ gap }} more {{ minRaceName }} residents</strong> need to be tested to close this gap.",
  noGap:
    "In {{ name }}, <strong>{{ rate }}</strong> per 100,000 {{ race }} residents got tested compared to our goal of {{ expectedRate }} tests per 100,000 statewide.",
  noInfo:
    "In {{ name }}, there isn't enough testing data on <strong>{{ race }} residents</strong> to determine the number of tests needed to close the gap.",
  highest:
    "The largest gap is among <strong>{{ minRaceName }} residents</strong>. Only <strong>{{ rate }}</strong> per 100,000 {{ minRaceName }} residents were tested. Approximately <strong>{{ gap }}</strong> more {{ minRaceName }} residents need to be tested to close this gap.",
  kpiTitle: "{{ race }} residents tested per 100,000 in {{ name }}",
  gapKpiTitle:
    "Approximate tests for {{ race }} residents needed to close the gap",
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

.centered {
  display: grid;
  place-content: center;
}

.invisible {
  visibility: hidden;
}
</style>
