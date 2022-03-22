<template>
  <div class="dashboard-card" :class="['is-' + width, 'is-height-' + height]">
    <header class="dashboard-card-header fullwidth">
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between fullwidth"
      >
        <h2 class="title mb-3 is-flex-grow-1"><slot name="title"></slot></h2>
        <div><slot name="top-right"></slot></div>
      </div>
      <h3 class="subtitle">
        <slot name="subtitle" />
      </h3>
    </header>
    <section class="card-content">
      <slot name="content" />
    </section>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: number;
}

withDefaults(defineProps<Props>(), {
  width: "full",
  height: 2,
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.dashboard-card {
  @extend .box;
  margin-bottom: 0 !important; /* overrides .box */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: visible;
}

.dashboard-card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @extend .px-4;
  @extend .py-4;
}

.fullwidth {
  width: 100%;
}

.card-content {
  padding: 0;
  width: 100%;
  flex: 1;
}

.is-one-third {
  grid-column-start: span 2;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-half {
  grid-column-start: span 3;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-full {
  grid-column-start: span 6;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-two-thirds {
  grid-column-start: span 4;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-height-1 {
  grid-row-start: span 1;
}
.is-height-2 {
  grid-row-start: span 2;
}
.is-height-3 {
  grid-row-start: span 3;
}
.is-height-4 {
  grid-row-start: span 4;
}
.is-height-5 {
  grid-row-start: span 5;
}
.is-height-6 {
  grid-row-start: span 6;
}
</style>
