<template>
  <div :class="[collapsed ? 'dashboard-grid-collapsed' : 'dashboard-grid']">
    <aside class="sidebar">
      <SideBar @toggle="collapsed = !collapsed" />
    </aside>
    <main>
      <nav class="main-nav">
        <BreadCrumb :path="$route.path" />
      </nav>

      <header class="main-header">
        <span class="title"
          ><i class="fas fa-chart-area mr-2" />{{ $route.name }}</span
        >
      </header>

      <section class="main-section">
        <div class="dashboard-contents">
          <slot />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import BreadCrumb from "@/components/base/BreadCrumb.vue";
import SideBar from "@/components/base/SideBar.vue";

const collapsed = ref(false);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.sidebar {
  border-right: 1px solid #a4b1bf;
  grid-area: sidebar;
  overflow: hidden;
  background-color: whitesmoke;
  min-height: 90vh;
  @include mobile {
    min-height: auto;
  }
}
main {
  grid-area: main;
}
.dashboard-grid {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: minmax(13rem, 2fr) 10fr;
  grid-template-areas: "sidebar main";
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-areas:
      "sidebar"
      "main";
  }
}
.dashboard-grid-collapsed {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 8ch auto;
  grid-template-areas: "sidebar main";
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-rows: auto auto;
    grid-template-areas:
      "sidebar"
      "main";
  }
}

.dashboard-contents {
  grid-area: main-section;
  @extend .px-4;
  @extend .py-4;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto;
  column-gap: 15px;
  row-gap: 15px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: space-between;
  align-content: start;
  grid-auto-flow: row;
  @include mobile {
    grid-template-columns: 100vw;
    column-gap: 0px;
    padding-left: 0px !important; // overrides @extend px-4
    padding-right: 0px !important; // overrides @extend px-4
  }
}

.main-header {
  grid-area: main-header;
  border-bottom: 1px solid #a4b1bf;
  @extend .px-4;
  @extend .py-4;
}
.main-nav {
  grid-area: main-nav;
  border-bottom: 1px solid #a4b1bf;
  @extend .px-4;
  @extend .py-4;
}
</style>
