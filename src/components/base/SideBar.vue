<template>
  <div :class="[collapsed ? 'p-2' : 'p-4']">
    <div class="has-text-right">
      <button type="button" class="button bars px-0" @click="toggle">
        <i v-if="!collapsed" class="fas fa-times" />
        <i v-else class="fas fa-bars" />
      </button>
    </div>
    <div class="sidebar-body" :class="{ 'is-hidden-mobile': collapsed }">
      <p v-if="!collapsed" class="menu-label">Project SIGNAL</p>
      <p v-else class="menu-label">
        <abbr title="Project SIGNAL">PS</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <router-link to="/">
            <i class="fas fa-home mr-1" />
            <span v-if="!collapsed">Home</span>
            <VisuallyHidden v-else>Home</VisuallyHidden>
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <i class="fas fa-info-circle mr-1" />
            <span v-if="!collapsed">About</span>
            <VisuallyHidden v-else>About</VisuallyHidden>
          </router-link>
        </li>
      </ul>
      <p v-if="!collapsed" class="menu-label">Exploration Datasets</p>
      <p v-else class="menu-label">
        <abbr title="Exploration Datasets">DATA</abbr>
      </p>
      <ul class="menu-list">
        <li v-for="item in DATASETS" :key="item.route">
          <router-link
            v-if="item.available"
            :class="{ 'is-active': activeRoute === item.route }"
            :aria-disabled="!item.available"
            :to="'/dataset/' + item.route"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <i class="fas fa-poll mr-1" />
                <span>{{ initials(item.name) }}</span>
              </abbr></span
            >
          </router-link>
          <a
            v-else
            disabled
            :aria-disabled="!item.available"
            class="not-allowed-cursor"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <i class="fas fa-poll mr-1" />
                <span>{{ initials(item.name) }}</span>
              </abbr></span
            >
            <span v-if="!collapsed" class="tag is-light is-warning ml-2"
              >coming soon</span
            ></a
          >
        </li>
      </ul>
      <p v-if="!collapsed" class="menu-label">Resources</p>
      <p v-else class="menu-label">
        <abbr title="Resources">Src</abbr>
      </p>
      <ul class="menu-list">
        <li v-for="(item, i) in RESOURCES" :key="i">
          <a :href="item.link">
            <div v-if="!collapsed" class="is-flex is-align-items-center">
              <i class="fas mr-1" :class="item.icon" />
              <div>{{ item.title }}</div>
            </div>
            <abbr v-else :title="item.title" class="collapsed-flex-item">
              <i class="fas mr-1" :class="item.icon" />
              <span>{{ item.initials }}</span>
            </abbr>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import VisuallyHidden from "@/components/base/VisuallyHidden.vue";

const emit = defineEmits(["toggle"]);

const initials = (str) => {
  return str
    .split(" ")
    .map((s) => s[0].toUpperCase())
    .join("");
};

const collapsed = ref(false);

const DATASETS = [
  {
    name: "Vaccine Cold Spots",
    route: "vaccine-cold-spot",
    available: true,
  },
  {
    name: "Testing Cold Spots",
    route: "testing-cold-spot",
    available: false,
  },
];

const RESOURCES = [
  {
    title: "RIDOH Covid Data Hub",
    initials: "CDH",
    link: "https://ri-department-of-health-covid-19-data-rihealth.hub.arcgis.com/",
    icon: "fa-anchor",
  },
  {
    title: "RIDOH Covid Info",
    initials: "CI",
    link: "https://covid.ri.gov/",
    icon: "fa-sitemap",
  },
];

const toggle = () => {
  collapsed.value = !collapsed.value;
  return emit("toggle", collapsed.value);
};

import { useRoute } from "vue-router";
const route = useRoute();
const activeRoute = computed(() => {
  const paths = route.path.split("/").filter((p) => p);
  if (paths.length > 1) {
    return paths[1];
  } else {
    return "";
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";
.not-allowed-cursor {
  cursor: not-allowed;
}
.bars {
  border: none;
  background-color: whitesmoke;
}
.collapsed-flex-item {
  display: flex;
  align-items: center;
  justify-items: center;
  margin-left: -0.35rem;
  span {
    font-size: 0.6rem;
  }
}

.menu-list a {
  padding-right: 0;
  padding-left: 0.5em;
}
</style>
