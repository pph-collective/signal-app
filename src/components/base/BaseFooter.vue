<template>
  <footer class="footer-grid footer-container">
    <section class="footer-grid-section-a footer-left">
      <!-- <div class="logo-container">
        <img src="@/assets/illustrations/ricaim-logo-name.svg" />
      </div>
      <div class="logo-container">
        <img
          src="@/assets/illustrations/uri-logo.svg"
          class="uri logo-container"
        />
      </div>
      <div class="logo-container">
        <img
          src="@/assets/illustrations/brown-logo.svg"
          class="brown logo-container"
        />
      </div> -->
    </section>
    <section class="footer-grid-section-b footer-right">
      <p class="container content">Funding info</p>
      <div class="logo-container">
        <!-- <img
          src="@/assets/illustrations/nsf.svg"
          class="brown logo-container"
        /> -->
      </div>
    </section>
    <section class="footer-grid-bottom">
      <i class="far fa-copyright" />
      <span class="copyright-span">{{ year }}</span>
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
  grid-template-areas: "section-a" "section-b" "bottom";
  grid-gap: 1rem;
  &-section-a {
    grid-area: section-a;
  }
  &-section-b {
    grid-area: section-b;
  }
  &-bottom {
    grid-area: bottom;
    text-align: center;
  }
  @include tablet {
    grid-template-areas: " . . " "section-a section-b" "bottom bottom";
    grid-template-columns: 6fr 6fr;
    grid-template-rows: 2rem 13rem 2rem;
  }
}
.copyright-span {
  @include desktop {
    margin-left: 1rem;
  }
}
.footer-container {
  background-color: $info;
  padding: 1rem 1.5rem 3rem;
}
.footer-left {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.envelope-icon {
  margin-right: 1rem;
}
.footer-right {
  display: flex;
  flex-direction: column;
  @include desktop {
    flex-direction: row;
  }
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  .container {
    flex-basis: 70%;
  }
}
.logo-container {
  width: 4rem;
  @include desktop {
    width: 8rem;
  }
}
</style>
