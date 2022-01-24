<template>
  <div class="sidebar-container" :class="[collapsed ? 'p-2' : 'p-4']">
    <div class="has-text-right">
      <button type="button" class="button bars px-0" @click="toggle">
        <i v-if="!collapsed" class="fas fa-times" />
        <i v-else class="fas fa-bars" />
      </button>
    </div>
    <div class="sidebar-body" :class="{ 'is-hidden-mobile': collapsed }">
      <p v-if="!collapsed" class="menu-label">Narragansett Bay Data Explorer</p>
      <p v-else class="menu-label">
        <abbr title="Narragansett Bay Data Explorer">NBDE</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <router-link to="/">
            <i class="fas fa-home mr-1" />
            <span v-if="!collapsed">Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <i class="fas fa-info-circle mr-1" />
            <span v-if="!collapsed">About</span>
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
            <span v-if="!collapsed">
              <i class="fas mr-1" :class="item.icon" />
              <span>{{ item.title }}</span>
            </span>
            <span v-else>
              <abbr :title="item.title" class="collapsed-flex-item">
                <i class="fas mr-1" :class="item.icon" />
                <span>{{ item.initials }}</span>
              </abbr>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

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
    name: "RI Buoy Data",
    route: "ri-buoy",
    available: true,
  },
  {
    name: "MA Buoy Data",
    route: "ma-buoy",
    available: true,
  },
  {
    name: "Ocean State Ocean Model",
    route: "osom",
    available: true,
  },
  {
    name: "Plankton Time Series",
    route: "plankton",
    available: true,
  },
  {
    name: "Domoic Acid",
    route: "domoic-acid",
    available: true,
  },
  {
    name: "Fish Trawl Survey",
    route: "fish",
    available: true,
  },
];

const RESOURCES = [
  {
    title: "Rhode Island Data Discovery Center Home",
    initials: "RIDDC",
    link: "https://ridatadiscovery.org",
    icon: "fa-water",
  },
  {
    title: "ERDDAP Server",
    initials: "ES",
    link: "https://pricaimcit.services.brown.edu/erddap/index.html",
    icon: "fa-database",
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
</style>
