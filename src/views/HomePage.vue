<template>
  <div>
    <main class="hero grid-container">
      <div class="item1 pt-4">
        <div class="center">
          <h1 class="home-title pb-4">Narragansett Bay Data Explorer</h1>
          <h2 class="home-subtitle pb-4">
            Explore historical data collected from multiple buoys in the
            Narragansett Bay
          </h2>
          <router-link
            class="button is-large has-text-light is-primary"
            to="/dataset/"
          >
            <span class="is-size-3">Start Exploring</span>
            <i class="ml-3 is-size-3 fas fa-compass" />
          </router-link>
        </div>
      </div>
      <div class="item2 chart">
        <p>A thing someday!</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

$gradient1: #598daf;
$gradient2: #fdbc89;
$gradient3: #f8eade;

.home-title {
  @extend .title;
  font-size: $size-1 * 1.4;
}
.home-subtitle {
  @extend .subtitle;
  font-size: $size-4 * 1.4;
}

.grid-container {
  background-image: linear-gradient($gradient1, $gradient2, $gradient3);
  display: grid;
  grid-template-columns: 1fr 4fr minmax(300px, 5fr) 1fr;
  grid-template-rows: 2rem auto;
  grid-template-areas:
    ". . . . "
    ". area1 area2 .";
  @include mobile {
    grid-template-rows: auto 0px;
    grid-template-columns: 1fr 20fr 1fr;
    grid-template-areas:
      ". area1 ."
      ". area2 .";
  }
}

.item1 {
  display: grid;
  grid-area: area1;
  align-content: start;
  justify-items: start;
  grid-template-columns: 1fr 9fr 1fr;
  grid-template-rows: 8rem auto 5rem;
  grid-template-areas:
    ". top ."
    ". center ."
    ". bottom .";
}
.center {
  grid-area: center;
}
.item2 {
  grid-area: area2;
  display: grid;
  justify-content: center;
  align-content: center;
  max-width: 100vw;
  @include mobile {
    display: none;
    visibility: hidden;
  }
}
.waves {
  margin-top: -10rem;
  @include mobile {
    visibility: hidden;
  }
}
</style>
