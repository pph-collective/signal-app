<template>
  <DashboardCard width="full">
    <template #subtitle>
      This tool shows us places where fewer people have received a booster dose
      compared to state levels. We call this difference in booster doses a
      <em>gap</em>. Vaccines can keep us from getting very sick with COVID-19,
      but protection decreases over time. A booster is another dose of the
      vaccine that keeps your community protected. You can use this information
      to find where the gaps are in our state and take steps to help close them.
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
        class="zoom-button button is-secondary is-light"
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
      This map shows where there are gaps in booster doses. Darker areas show
      bigger gaps in booster doses among
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
          class="is-absolute"
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
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="2">
    <template #title
      >How many booster doses do we need to close the gap?</template
    >
    <template #content>
      <HiddenContent :show="activeCluster.name !== ''">
        <GapByRace
          :stats="data.stats"
          :active-cluster="activeCluster"
          :field-names="['asian', 'black', 'latino', 'white']"
          :focus-stat="controls.focusStat"
          :gap-type="'booster'"
        />
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="2">
    <template #title>How do we reach people who need vaccines?</template>
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
      </HiddenContent>
    </template>
  </DashboardCard>

  <DashboardCard width="full">
    <template #title>What can I do to close the gap?</template>
    <template #content>
      <div class="px-4 content">
        <h5>
          I can raise awareness and address my community's concerns about
          vaccines:
        </h5>
        <ul>
          <li>
            You can
            <ExternalLink
              href="https://health.ri.gov/publications/actionplans/COVID-vaccine-outreach.pdf"
              >educate your community about vaccines and build trust </ExternalLink
            >. This document has videos and messages you can share with people
            in your community.
          </li>
          <li>
            You can also promote
            <ExternalLink
              href="https://drive.google.com/drive/folders/11NgvrZgqLs34MO2qicAp48Cnn5O_5Cg7"
              >resources for communities with special needs </ExternalLink
            >.
          </li>
        </ul>
        <h5>I can promote upcoming vaccine clinics in my neighborhood:</h5>
        <ul>
          <li>
            First, check the
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSv20xMlWQJON8jXvPtzdAo1KU-Rr6Eu6u02nUuVEu-Bz2t_M6JBzYLfFaL_jPZqLiAQZVigFcssKwx/pubhtml"
              >list of upcoming vaccine clinics
            </ExternalLink>
            to get information about the clinic(s) you want to promote.
          </li>
          <li>
            Next, you can create
            <ExternalLink
              href="https://drive.google.com/drive/folders/1ZpYrchu-srZJJSmn-yMDRPw-LfgbWIzB"
              >promotional materials and promote
            </ExternalLink>
            upcoming clinics. This will help you let people in your community
            know what is happening.
          </li>
          <li>
            You can also let people know
            <ExternalLink href="https://covid.ri.gov/vaccination#athome"
              >how to get vaccinated at home </ExternalLink
            >.This is a good option for people who may have a harder time
            accessing a clinic.
          </li>
        </ul>
        <h5>I can set up a new vaccine clinic in my neighborhood:</h5>
        <ul>
          <li>
            Get started by
            <ExternalLink
              href="https://forms.office.com/Pages/ResponsePage.aspx?id=VGrKUmVENUa_82XQqEEiiDhbUGCR_dNCilNlrWlEGs1UN1A3UVY1QlhJQVZJNTFFTTM4WUkwREtEMS4u"
              >filling out an interest form </ExternalLink
            >. A member of the RIDOH team will reach out to you within 3-5
            business days.
          </li>
          <li>
            Next, you can create
            <ExternalLink
              href="https://drive.google.com/drive/folders/1ZpYrchu-srZJJSmn-yMDRPw-LfgbWIzB"
              >promotional materials and promote
            </ExternalLink>
            your clinic. This toolkit has resources that you may need to reach
            people in your neighborhood.
          </li>
        </ul>
        <h5>
          I can make sure people know where to go to get treatment for COVID-19:
        </h5>
        <ul>
          <li>
            Find out
            <ExternalLink
              href="https://covid-19-test-to-treat-locator-dhhs.hub.arcgis.com/"
              >where you can find treatment in your neighborhood </ExternalLink
            >.
          </li>
        </ul>
        <h5>
          I can find more resources at the
          <ExternalLink
            href="https://covid.ri.gov/public/covid-19-community-partner-toolkit"
            >Community Partner Toolkit website </ExternalLink
          >.
        </h5>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="2">
    <template #subtitle>Data Notes</template>
    <template #content>
      <div class="px-4 content">
        <p class="is-size-7">
          This web tool includes information on vaccines administered to Rhode
          Island residents as recorded in the
          <ExternalLink
            href="https://health.ri.gov/programs/detail.php?pgm_id=156681"
            >Rhode Island Child and Adult Immunization Registry</ExternalLink
          >
          at the Rhode Island Department of Health. Rhode Island residents with
          invalid or incomplete residential address information are excluded.
          Data for Rhode Island residents who were vaccinated at federal
          facilities or in other states are not included unless they have
          submitted a copy of their vaccination record to the Rhode Island
          Department of Health.
        </p>

        <p class="is-size-7">
          Estimates of population size are sourced from the United States Census
          Bureau's
          <ExternalLink href="https://www.census.gov/programs-surveys/acs"
            >American Community Survey</ExternalLink
          >
          (2015-2019, 5-year estimates). There is statistical uncertainty
          associated with these estimates, particularly for small populations in
          small geographic areas, resulting in estimates of vaccine coverage
          that are unreliable. Some estimates may be suppressed in line with the
          Rhode Island Department of
          <ExternalLink
            href="https://health.ri.gov/publications/policies/SmallNumbersReporting.pdf"
            >Health's Small Numbers Reporting Policy</ExternalLink
          >. All vaccine coverage estimates are capped at 99%.
        </p>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="1">
    <template #content>
      <div
        class="field is-horizontal is-justify-content-center is-align-items-center has-flex-gap"
      >
        <label for="date">Looking for data from another time period?</label>
        <div class="control has-icons-left is-flex is-justify-content-center">
          <div class="select">
            <select
              id="date"
              @change="$emit('newDate', ($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="(option, index) in dropdownDates"
                :key="'option-' + index"
                :value="option.value"
                :selected="option.value === currentDate"
              >
                {{ option.name }}
              </option>
            </select>
            <span class="icon is-small is-left pl-1">
              <i class="fas fa-calendar-alt"></i>
            </span>
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

import RI_GEOJSON from "@/assets/geography/ri.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import HiddenContent from "@/components/base/HiddenContent.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapByRace from "@/components/dashboard/GapByRace.vue";
import PotentialBarriers from "@/components/dashboard/PotentialBarriers.vue";
import RedDot from "@/components/dashboard/RedDot.vue";
import ExternalLink from "@/components/base/ExternalLink.vue";

import { useQueryParam } from "../../../composables/useQueryParam";

import { fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";
import { prettyDate } from "../../../utils/utils";

const zoomed = ref(false);
useQueryParam({
  param: "zoom",
  ref: zoomed,
  valid: (p) => ["true", "false"].includes(p),
  valToParam: (v) => v.toString(),
  paramToVal: (p) => p === "true",
});

defineEmits(["newDate"]);

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

const dropdownDates = props.dates.map((date) => {
  const dateString = prettyDate(date);
  return { name: dateString, value: date };
});

const townDefault = "All of Rhode Island";
const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const dropDowns = {
  town: {
    icon: "fas fa-globe",
    label: "Where do you want to look?",
    values: [townDefault, ...towns],
  },
  focusStat: {
    label: "Which group do you want to focus on?",
    icon: "fas fa-fill-drip",
    values: [
      { name: "All residents", value: "total" },
      { name: "White residents", value: "white" },
      { name: "Black residents", value: "black" },
      { name: "Latino residents", value: "latino" },
      { name: "Asian residents", value: "asian" },
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
  // only update when the controls change to avoid a render loop
  dashboardActiveCluster.value = activeCluster.value;

  // zoom back out, selections don't make sense with zoom in
  if (zoomed.value) {
    zoomed.value = false;
  }

  // new town selected, unselect active cluster
  if (newControls.town !== controls.value.town) {
    activeCluster.value = NULL_CLUSTER;
    dashboardActiveCluster.value = NULL_CLUSTER;
  }

  // update the control selections
  for (const [k, v] of Object.entries(newControls)) {
    controls.value[k] = v;
  }
};

const updateCluster = (newClusterId) => {
  activeCluster.value = clusterIdToCluster(newClusterId);
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
</style>
