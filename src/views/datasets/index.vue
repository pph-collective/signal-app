<template>
  <router-view v-slot="{ Component }">
    <SuspenseComponent :key="$route.path">
      <DashboardLayout>
        <component :is="Component"></component>
      </DashboardLayout>
    </SuspenseComponent>
  </router-view>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import SuspenseComponent from "@/components/base/SuspenseComponent.vue";
</script>
