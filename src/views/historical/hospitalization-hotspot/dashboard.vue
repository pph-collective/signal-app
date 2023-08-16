<template>
  <DashboardCard width="full">
    <template #subtitle>
      This tool shows us places where people who have gone to the hospital with
      COVID-19 live. This tool focuses on places where more people have gone to
      the hospital compared to state levels. We call these places
      <em>hotspots</em>. You can use this information to find where the hotspots
      are in our state and take steps to help eliminate them.
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
      This map shows hotspots where more people have gone to the hospital with
      COVID-19 compared to state levels. Darker areas show hotspots. Areas with
      dashes mean there is not enough information available to show a
      hospitalization rate. Select a community, click the
      <em>Zoom to Community</em>
      button, and scroll down to learn more.
    </template>

    <template #content>
      <div class="map-container">
        <ColdMap
          :geo="data.geo"
          :stats="data.stats"
          :filter-town="controls.town"
          :focus-stat="controls.focusStat"
          :initial-active-cluster="dashboardActiveCluster"
          :map-type="'hot'"
          class="is-absolute"
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
          :to="`/dataset/hospitalization-hotspot?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#chart`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </div>
    </template>
  </DashboardCard>
  <DashboardCard id="chart" width="full" :height="2">
    <template #title
      >Who was hospitalized with COVID-19 between {{ startDate }} and
      {{ endDate }}?</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <HotspotCard
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
          :date="currentDate"
          :phrases="phrases"
        />
        <div :class="{ invisible: activeCluster.name === '' }">
          <router-link
            :to="`/dataset/hospitalization-hotspot?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#barriers`"
          >
            <i class="fa fa-arrow-circle-down fa-2x centered" />
          </router-link>
        </div>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="barriers" width="full" :height="2">
    <template #title
      >How do we keep people from needing to go to the hospital with
      COVID-19?</template
    >
    <template #subtitle
      >When people have fewer resources, like money or vaccines or treatment, it
      is harder to stay healthy. It is important that all people can access
      things like vaccines and treatments when they need them. This is
      especially important for older adults and others who are at risk for
      getting very sick from COVID-19.</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <PotentialBarriers
          :barriers="data.barriers"
          :state-barriers="data.state_barriers"
          :active-cluster="activeCluster"
        />
        <router-link
          :to="`/dataset/hospitalization-hotspot?town=${controls.town}&stat=${controls.focusStat.value}&cluster=${activeCluster.cluster_id}&zoom=${zoomed}&date=${currentDate}#resources`"
        >
          <i class="fa fa-arrow-circle-down fa-2x centered" />
        </router-link>
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard id="resources" width="full">
    <template #title
      >What can I do to lower the chances that someone in my community needs to
      go to the hospital?</template
    >
    <template #content>
      <div>
        <div class="px-4 content">
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
              You can also let people know
              <ExternalLink href="https://covid.ri.gov/vaccination#athome">
                how to get vaccinated at home </ExternalLink
              >. This is a good option for people who may have a harder time
              accessing a clinic.
            </li>
          </ul>
          <h5>
            Make sure people know where to go to get treatment for COVID-19:
          </h5>
          <ul>
            <li>
              Help people
              <ExternalLink href="https://covid.ri.gov/detect/testing"
                >get tested</ExternalLink
              >
              so they can start treatment as soon as possible.
            </li>
            <li>
              Learn about
              <ExternalLink
                href="https://covid.ri.gov/treat/therapeutics?gclid=CjwKCAjwpayjBhAnEiwA-7ena53D2cKyXNp0MgIbBXPPz27355gBrR3UTplmWLarJHLRR3ZBFM_aJBoCMgwQAvD_BwE"
              >
                the treatments available
              </ExternalLink>
              for COVID-19.
            </li>
            <li>
              Find out
              <ExternalLink
                href="https://covid-19-test-to-treat-locator-dhhs.hub.arcgis.com/"
              >
                where you can find treatment in your neighborhood </ExternalLink
              >.
            </li>
          </ul>
          <h5>
            Make sure people know how to keep their health insurance coverage.
          </h5>
          <ul>
            <li>
              You can use this
              <ExternalLink
                href="https://staycovered.ri.gov/community-support/community-advocate-forum"
                >community advocate toolkit</ExternalLink
              >
              to help people learn about Medicaid renewals.
            </li>
            <li>
              You can help people understand their options for getting a new
              health insurance plan through
              <ExternalLink href="https://healthsourceri.com/transitions/"
                >HealthSourceRI</ExternalLink
              >.
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
        <p>
          This web tool includes information on COVID-19-associated
          hospitalizations for Rhode Island residents who were admitted to an
          acute care or psychiatric inpatient facility for at least one night
          with COVID-19.
        </p>
        <p>
          After January 1, 2023, persons are included once per COVID-19
          infection if they had a laboratory-confirmed positive COVID-19 test
          within 14 days prior to the hospital admission (if COVID-19 is not a
          primary or contributing cause of hospitalization), within 30 days
          prior to hospital admission (if COVID-19 is a primary or contributing
          cause of hospitalization), or within 3 days after hospital admission
          (regardless of the cause of hospitalization)
        </p>
        <p>
          Prior to January 1, 2023, these data include persons admitted to an
          inpatient facility for at least one night with a laboratory-confirmed
          positive COVID-19 test, regardless of when the test was performed.
          Hospitalizations prior to this date also counted an individual more
          than once if they were readmitted during the course of a single
          COVId-19 infection.
        </p>
        <p>
          Estimates of population size are sourced from the United States Census
          Bureau's
          <ExternalLink href="https://www.census.gov/programs-surveys/acs"
            >American Community Survey</ExternalLink
          >
          (2016-2020, 5-year estimates). There is statistical uncertainty
          associated with these estimates, particularly for small populations in
          small geographic areas, resulting in estimates of hospitalization
          rates that are unreliable. Some estimates may be suppressed in line
          with the Rhode Island Department of Health's
          <ExternalLink
            href="https://health.ri.gov/publications/policies/SmallNumbersReporting.pdf"
            >Small Numbers Reporting Policy</ExternalLink
          >.
        </p>
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
import { format, add } from "date-fns";

import RI_GEOJSON from "@/assets/geography/ri.json";
import HEZ_GEOJSON from "@/assets/geography/hez.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import HotspotCard from "@/components/dashboard/HotspotCard.vue";
import HiddenContent from "@/components/base/HiddenContent.vue";
import PotentialBarriers from "@/components/dashboard/PotentialBarriers.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

import { fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";
import ChooseDate from "../../../components/dashboard/ChooseDate.vue";
import ExternalLink from "../../../components/base/ExternalLink.vue";
import { parseISOlocal } from "../../../utils/utils";

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
  { deep: true }
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
  gap: "In {{ name }}, about <strong>{{ rate }} per 100,000 {{ race }} residents</strong> were hospitalized. This was higher than the overall rate in Rhode Island.",
  allResidents:
    "In {{ name }}, the rate of people who were hospitalized was highest among {{ maxRaceName }} residents. About <strong>{{ rate }} per 100,000 {{ maxRaceName }} residents</strong> were hospitalized.",
  noGap:
    "In {{ name }}, about <strong>{{ rate }} per 100,000 {{ race }} residents</strong> were hospitalized. This was lower than the overall rate in Rhode Island.",
  noInfo:
    "In {{ name }}, there isn't enough hospitalization data on {{ race }} residents to determine their hospitalization rate.",
  highest:
    "The highest rate of hospitalization was among <strong>{{ race }} residents</strong>. About {{ rate }} per 100,000 {{ race }} residents were hospitalized.",
  kpiTitle: "per 100,000 {{ race }} residents hospitalized in {{ name }}.",
};

const startDate =
  parseISOlocal(props.currentDate).getMonth() >= 10
    ? format(parseISOlocal(props.currentDate), "MMMM yyyy")
    : format(parseISOlocal(props.currentDate), "MMMM");

const endDate = format(
  add(parseISOlocal(props.currentDate), { months: 2 }),
  "MMMM yyyy"
);
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
