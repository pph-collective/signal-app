<template>
  <footer class="footer-grid footer-container">
    <section class="footer-body">
      <div class="logo-container">
        <img class="logo" src="@/assets/images/ridoh-logo-white.png" />
      </div>
      <div class="logo-container">
        <img src="@/assets/images/brown-sph-logo-reverse.svg" class="logo" />
      </div>
    </section>
    <section class="footer-bottom has-text-light has-text-weight-medium">
      <i class="far fa-copyright" />
      <span class="copyright-span">{{ year }} </span>
      <span class="copyright-span">People, Place and Health Collective</span>
    </section>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.footer-grid {
  display: grid;
  grid-template-areas: "section" "bottom";
  grid-gap: 1rem;
  @include tablet {
    grid-template-areas: " ." "section" "bottom";
    grid-template-columns: 6fr;
    grid-template-rows: 2rem 13rem 2rem;
  }
}
.copyright-span {
  @include desktop {
    margin-left: 1rem;
  }
}
.footer-container {
  background-color: $dark;
  padding: 1rem 1.5rem 3rem;
}
.footer-body {
  width: 100%;
  grid-area: section;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.footer-bottom {
  grid-area: bottom;
  text-align: center;
}
.logo-container {
  height: 4rem;
  @include tablet {
    height: 8rem;
  }
}
.logo {
  height: 100%;
  max-width: 100%;
}
</style>
