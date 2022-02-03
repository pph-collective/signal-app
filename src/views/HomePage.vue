<template>
  <div>
    <main class="hero grid-container header-image">
      <div class="item1 pt-4">
        <h1
          class="home-title pb-4 has-text-right has-text-light is-family-secondary"
        >
          Project SIGNAL
        </h1>
        <h2 class="home-subtitle pb-4 has-text-light">
          Explore COVID-19 RI datsets from Project SIGNAL
        </h2>
        <div class="is-flex is-justify-content-center">
          <router-link
            class="button is-large has-text-light is-link"
            to="/dataset/"
          >
            <span class="is-size-3">Start Exploring</span>
            <BaseLogo :inverted="true" />
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseLogo from "@/components/base/BaseLogo.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.home-title {
  @extend .title;
  font-size: $size-1 * 1.4;
}
.home-subtitle {
  @extend .subtitle;
  font-size: $size-4 * 1.4;
}

.grid-container {
  background-image: linear-gradient($link, $primary);
  display: grid;
  min-height: max(37.5rem, 93vh);
  grid-template-columns: 1fr minmax(5fr, 600px) 1fr;
  grid-template-areas:
    ". . . "
    ". area1 ."
    ". . . ";
  @include mobile {
    grid-template-columns: 1fr 20fr 1fr;
  }
}

.item1 {
  grid-area: area1;
  display: flex;
  max-height: 50vh;
  flex-direction: column;
  justify-content: space-around;
}

.header-image {
  background-image: url("../assets/images/folco-masi-6tbZUEqruQQ-unsplash.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #999;
}
</style>
