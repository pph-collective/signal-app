<template>
  <DashboardCard width="full">
    <template #subtitle>
      Direct trade jianbing pug blog letterpress. Meditation slow-carb raclette
      meggings. Vice chia polaroid cronut, gentrify tumblr typewriter art party
      knausgaard. Tilde brooklyn listicle photo booth XOXO cardigan kinfolk
      live-edge twee tumeric.
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
        ? `Cold spot: ${activeCluster.name}`
        : "Select a cold spot to explore"
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
        <span>{{ zoomed ? "Zoom Back Out" : "Zoom to Cold Spot" }}</span>
      </button>
    </template>

    <template #subtitle>
      Tacos freegan activated charcoal eu hell of humblebrag tofu raw denim duis
      bicycle rights irure pinterest. Live-edge tote bag tattooed pabst
      biodiesel etsy knausgaard lo-fi tbh bushwick ethical lorem humblebrag
      tumeric. Cardigan four dollar toast yr, affogato eu plaid disrupt man bun
      man braid tote bag trust fund ea meditation.
    </template>

    <template #content>
      <div class="map-container">
        <ColdMap
          :geo="data.geo"
          :stats="data.stats"
          :filter-town="controls.town"
          :fill-stat="controls.fillStat"
          :initial-active-cluster="dashboardActiveCluster"
          class="is-absolute"
          @new-active-cluster="updateCluster"
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
import { computed, ref } from "vue";

import RI_GEOJSON from "@/assets/geography/ri.json";
import ControlPanel from "@/components/dashboard/ControlPanel.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import ColdMap from "@/components/dashboard/ColdMap.vue";
import HiddenContent from "@/components/base/HiddenContent.vue";
import ClusterMap from "@/components/dashboard/ClusterMap.vue";
import GapByRace from "@/components/dashboard/GapByRace.vue";
import PotentialBarriers from "@/components/dashboard/PotentialBarriers.vue";

import { fetchColdSpotData } from "../../../utils/firebase";
import { NULL_CLUSTER } from "../../../utils/constants";
import { prettyDate } from "../../../utils/utils";

const activeCluster = ref(NULL_CLUSTER);
const dashboardActiveCluster = ref(NULL_CLUSTER);
const zoomed = ref(false);

defineEmits(["newDate"]);

const props = defineProps<{
  dates: string[];
  currentDate: string;
  datasetName: string;
}>();

// fetch the data
const data = await fetchColdSpotData(props.datasetName, props.currentDate);

const dropdownDates = props.dates.map((date) => {
  const dateString = prettyDate(date);
  return { name: dateString, value: date };
});

const townDefault = "All of Rhode Island";
const towns = RI_GEOJSON.map((geo) => geo.properties.name).sort();
const dropDowns = computed(() => {
  return {
    town: {
      icon: "fas fa-globe",
      label: "Where do you want to look into?",
      values: [townDefault, ...towns],
    },
    fillStat: {
      label: "Which statistic would you like to highlight on the map?",
      icon: "fas fa-fill-drip",
      values: [
        { name: "None", value: "", tooltip: "" },
        { name: "Overall Gap", value: "gap_total_pct", tooltip: "gap_total" },
        {
          name: "Doses to close gap for White residents",
          value: "gap_white_pct",
          tooltip: "gap_white",
        },
        {
          name: "Doses to close gap for Black residents",
          value: "gap_black_pct",
          tooltip: "gap_black",
        },
        {
          name: "Doses to close gap for Latino residents",
          value: "gap_latino_pct",
          tooltip: "gap_latino",
        },
        {
          name: "Doses to close gap for Asian residents",
          value: "gap_asian_pct",
          tooltip: "gap_asian",
        },
      ],
    },
  };
});

const controls = ref({
  fillStat: dropDowns.value.fillStat.values[0],
  town: townDefault,
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
  if (newClusterId === NULL_CLUSTER.cluster_id) {
    activeCluster.value = NULL_CLUSTER;
  } else {
    const { cluster_id, name } = data.stats.find(
      (s) => s.cluster_id === newClusterId
    );
    activeCluster.value = { cluster_id, name };
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

.has-flex-gap {
  gap: 1rem;
}
</style>
