<template>
  <div class="base-form">
    <div class="base-form-inputs">
      <slot name="inputs" />
    </div>
    <div class="base-form-buttons">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.base-form-inputs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.base-form-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
