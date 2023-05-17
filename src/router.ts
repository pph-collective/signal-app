import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DatasetPage from "@/views/datasets/index.vue";
import SpotlightPage from "@/views/spotlights/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
  {
    path: "/dataset",
    name: "Dataset",
    component: DatasetPage,
    children: [
      {
        path: "",
        redirect: "/dataset/vaccine-gap",
      },
      {
        path: "vaccine-gap",
        name: "Closing the Gap in COVID-19 Vaccination",
        component: () => import(`./views/datasets/vaccine-gap/index.vue`),
      },
      {
        path: "booster-gap",
        name: "Closing the Gap in COVID-19 Boosters",
        component: () => import("./views/datasets/booster-gap/index.vue"),
      },
      {
        path: "hospitalization-hotspot",
        name: "Hotspots of COVID-19 Hospitalizations",
        component: () =>
          import("./views/datasets/hospitalization-hotspot/index.vue"),
      },
    ],
  },
  {
    path: "/spotlight",
    name: "Spotlight",
    component: SpotlightPage,
    children: [
      {
        path: "",
        redirect: "/spotlight/housing",
      },
      {
        path: "housing",
        name: "COVID-19 Outcomes by Housing Type",
        component: () => import("./views/spotlights/housing/index.vue"),
      },
    ],
  },

  // catch all redirect
  { path: "/:pathMatch(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from) {
    // scroll to the top of the window on page change
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (to.path !== from.path) {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
