<template>
  <DashboardCard width="full">
    <template #subtitle> This has something to do with housing. </template>
  </DashboardCard>
  <DashboardCard width="two-thirds">
    <template #content>This might be a graph</template>
  </DashboardCard>
  <DashboardCard width="one-third">
    <template #content>explain the graph?</template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";
</script>
