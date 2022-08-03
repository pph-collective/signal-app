<template>
  <DashboardCard width="full">
    <template #subtitle> This has something to do with housing. </template>
  </DashboardCard>
  <DashboardCard width="two-thirds">
    <template #content>
      <!-- not sure if i need this div? doesn't seem to change anything -->
      <div class="signal-grid-container">
        <GroupBarChart />
      </div>
    </template>
  </DashboardCard>
  <DashboardCard width="one-third">
    <template #content>explain the graph?</template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";
import GroupBarChart from "@/components/dashboard/GroupBarChart.vue";
</script>
