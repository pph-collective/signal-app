<template>
  <div class="signal-grid-container px-4">
    <div class="content m-auto">
      <ul v-for="row in rows" :key="row.fieldName">
        <li v-if="typeof barrier[row.property] === 'number'">
          {{ row.text }}
        </li>
      </ul>
    </div>

    <div class="table-container m-auto">
      <table class="table is-narrow">
        <tbody>
          <tr>
            <th>Considerations</th>
            <th>Community</th>
            <th>State</th>
          </tr>
          <tr v-for="row in rows" :key="row.fieldName">
            <template v-if="typeof barrier[row.property] === 'number'">
              <td>{{ row.fieldName }}</td>
              <td>{{ formatPct(barrier[row.property]) }}</td>
              <td>{{ formatPct(stateBarriers[row.property]) }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { formatPct } from "../../utils/utils";

const props = defineProps<{
  barriers: ClusterBarrier[];
  stateBarriers: Barrier;
  activeCluster: Cluster;
}>();

const barrier = computed(
  () =>
    props.barriers.find(
      (b) => b.cluster_id === props.activeCluster.cluster_id
    ) ?? {}
);

const rows = [
  {
    fieldName: "No Vehicle Available",
    property: "pct_w_no_vehicle",
    text: "Without cars, people might have trouble traveling to certain vaccination sites.",
  },
  {
    fieldName: "No Health Insurance",
    property: "pct_w_no_insurance",
    text: "Without health insurance, people might have trouble paying for healthcare.",
  },
  {
    fieldName: "No Home Internet",
    property: "pct_w_no_internet",
    text: "Without internet access, people might have trouble making appointments online.",
  },
  {
    fieldName: "Limited English",
    property: "pct_w_no_english",
    text: "People who speak limited English might have trouble understanding materials in English.",
  },
  {
    fieldName: "Over 60",
    property: "pct_over_60",
    text: "People over 60 years old are at higher risk of needing to go to the hospital with COVID-19.",
  },
];
</script>

<style lang="scss" scoped>
.table td {
  vertical-align: middle;
}
</style>
