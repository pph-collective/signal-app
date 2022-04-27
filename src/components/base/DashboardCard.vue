<template>
  <div
    class="dashboard-card is-isolated"
    :class="['is-' + width, 'is-height-' + height]"
  >
    <header
      v-if="$slots.title || $slots.topRight || $slots.subtitle"
      class="dashboard-card-header fullwidth"
    >
      <div class="dashboard-title-row fullwidth mb-3">
        <h2 class="title mb-0 title-flex"><slot name="title"></slot></h2>
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
  background-color: $box-background-color;
  border-radius: $box-radius;
  color: $box-color;
  padding: $box-padding;
  margin-bottom: 0;
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

.dashboard-title-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.title-flex {
  flex: 1 0 15rem;
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
  @include touch {
    grid-column-start: span 1;
  }
}
.is-half {
  grid-column-start: span 3;
  @include touch {
    grid-column-start: span 1;
  }
}
.is-two-thirds {
  grid-column-start: span 4;
  @include tablet-only {
    grid-column-start: span 2;
  }
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-full {
  grid-column-start: span 6;
  @include tablet-only {
    grid-column-start: span 2;
  }
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
