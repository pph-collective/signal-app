<template>
  <div class="signal-grid-container px-4">
    <div class="content m-auto">
      <ul>
        <li>Without any cars, people rely on public transit to get around.</li>
        <li>
          Without health insurance, people might have trouble paying for health
          care.
        </li>
        <li>
          Without internet access, people might have trouble making appointments
          online.
        </li>
        <li>
          People who speak limited English might have trouble understanding
          materials in English.
        </li>
      </ul>
    </div>

    <div class="table-container m-auto">
      <table class="table is-narrow">
        <tbody>
          <tr>
            <th>Potential Barrier</th>
            <th>Community</th>
            <th>State</th>
          </tr>
          <tr v-for="row in rows" :key="row.fieldName">
            <td>{{ row.fieldName }}</td>
            <td>{{ formatPct(barrier[row.property]) }}</td>
            <td>99%</td>
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
  barriers: Barrier[];
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
  },
  {
    fieldName: "No Health Insurance",
    property: "pct_w_no_insurance",
  },
  {
    fieldName: "No Home Internet",
    property: "pct_w_no_internet",
  },
  {
    fieldName: "Non-English Speakers",
    property: "pct_w_no_english",
  },
];
</script>

<style lang="scss" scoped>
.table td {
  vertical-align: middle;
}
</style>
