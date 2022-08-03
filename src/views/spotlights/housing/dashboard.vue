<template>
  <DashboardCard width="full">
    <template #subtitle> This has something to do with housing. </template>
  </DashboardCard>
  <DashboardCard width="full">
    <template #content>
      <!-- not sure if i need this div? doesn't seem to change anything -->
      <div class="signal-grid-container">
        <div>
          <GroupBarChart />
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pretium
          tempor mi eget pellentesque. Etiam pharetra neque quis elit aliquam
          tristique. Donec at scelerisque nunc. Suspendisse malesuada erat non
          neque iaculis porttitor. Vestibulum egestas gravida sem, nec fermentum
          lacus sollicitudin non. Proin nunc mauris, porttitor ut ex vel,
          dapibus rutrum lacus. Aenean imperdiet, odio non accumsan consequat,
          enim mi vehicula arcu, ac porttitor urna dui vel tortor. Quisque ut
          nibh ut quam faucibus accumsan. Aenean mi elit, egestas a sem in,
          feugiat aliquet arcu. Proin tincidunt lacus pretium, ultrices libero
          vitae, pretium leo. In varius fermentum augue, id posuere enim
          porttitor ut. Quisque posuere quam at lorem pulvinar, ac laoreet risus
          sodales. Pellentesque semper tincidunt sapien vehicula feugiat. Donec
          finibus mi erat, eget rutrum turpis aliquet ut. Pellentesque habitant
          morbi tristique senectus et netus et malesuada fames ac turpis
          egestas.
        </div>
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
