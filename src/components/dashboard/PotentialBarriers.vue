<template>
  <div class="px-4">
    <p>
      People with fewer resources have a harder time getting vaccinated. People
      without health insurance might have trouble paying for health care. People
      without internet access might have trouble making appointments online.
      People without any cars need to rely on public transit to get around.
      People who speak limited English might have trouble understanding
      materials in English.
    </p>

    <table class="mt-4 centered">
      <tbody>
        <tr>
          <th>Potential Barrier</th>
          <th>Community</th>
          <th>State</th>
        </tr>
        <tr v-for="(row, i) in rows" :key="i">
          <td>{{ row.fieldName }}:</td>
          <td class="pl-2">{{ formatPct(barrier[row.property]) }}</td>
          <td class="pl-3">State number here</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { format } from "d3-format";

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

const formatPct = format(".0%");
</script>

<style scoped>
.centered {
  margin-left: auto;
  margin-right: auto;
}
</style>
