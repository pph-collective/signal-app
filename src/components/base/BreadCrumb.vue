<template>
  <div>
    <span v-for="(link, i) in links" :key="'link-' + link.name">
      <span v-if="link.path && i !== links.length - 1">
        <router-link class="plot-nav is-size-5" :to="link.path">
          <span>{{ link.name }}</span></router-link
        >
        <span class="mx-4 is-size-5">/</span>
      </span>
      <span v-else class="plot-nav is-size-5">{{ link.name }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  path: string;
}>();

const links = computed(() => {
  const pathParts = props.path.split("/").filter((p) => p);
  const dataset = pathParts[1];
  const pageType = pathParts.pop();
  const links = [
    { path: "/", name: "Home" },
    { path: `/dataset/${dataset}`, name: "Summary" },
  ];

  if (pageType === "dashboard") {
    links.push({ path: `/dataset/${dataset}/dashboard`, name: "Explore" });
  }

  return links;
});
</script>
