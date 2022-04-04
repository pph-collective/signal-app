<template>
  <div class="px-4">
    <p>
      Mlkshk consequat etsy celiac, fanny pack poke photo booth. Tbh narwhal
      pork belly wolf af chia. Plaid reprehenderit commodo swag actually anim
      VHS.
    </p>

    <table class="mt-4 centered">
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <th>{{ row.fieldName }}:</th>
          <td class="pl-2">{{ formatPct(barrier[row.property]) }}</td>
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
