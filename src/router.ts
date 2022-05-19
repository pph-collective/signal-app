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
    if (to.path !== from.path) {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
