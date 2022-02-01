import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DatasetPage from "@/views/datasets/index.vue";

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
    alias: "/datasets", // for backwards compatibility with buoy-viewer-nuxt
    component: DatasetPage,
    children: [
      {
        path: "",
        redirect: "/dataset/vaccine-cold-spot",
      },
      {
        path: "vaccine-cold-spot",
        name: "Vaccine Cold Spots",
        component: () => import(`./views/datasets/vaccine-cold-spot/index.vue`),
      },
    ],
  },

  // catch all redirect
  { path: "/:pathMatch(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
