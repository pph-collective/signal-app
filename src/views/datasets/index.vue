<template>
  <DashboardLayout>
    <router-view v-slot="{ Component }">
      <SuspenseComponent :key="$route.path">
        <component :is="Component"></component>
      </SuspenseComponent>
    </router-view>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";
</script>
