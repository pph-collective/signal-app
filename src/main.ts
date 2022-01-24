import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

import router from "./router";

// general styling
import "../node_modules/vue-multiselect/dist/vue-multiselect.css";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
import "@/assets/styles/main.scss";

createApp(App).use(router).use(createPinia()).mount("#app");
