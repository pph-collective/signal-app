<template>
  <div class="control-panel is-family-secondary">
    <div
      v-for="(options, type) in dropDowns"
      :key="'control-panel-dropdown-' + type"
      class="control-panel-dropdown control has-icons-left"
    >
      <label :for="type" class="is-family-primary"
        ><strong>{{ options.label }}</strong></label
      >
      <span class="select">
        <select :id="type" v-model="selected[type]">
          <template
            v-for="(option, index) in options.values"
            :key="'option-' + index"
          >
            <option v-if="option[0] === '-'" :disabled="true" :value="option">
              {{ option.substring(2) }}
            </option>
            <option v-else :key="'option-' + index" :value="option">
              {{ "&nbsp; &nbsp; &nbsp;" + (option.name || option) }}
            </option>
          </template>
        </select>
        <span class="icon is-small is-left pl-1">
          <i :class="options.icon"></i>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps({
  dropDowns: {
    type: Object,
    required: true,
  },
  initValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const emit = defineEmits(["selected"]);

const res = {};
Object.keys(props.dropDowns).forEach((k) => {
  res[k] = props.initValue[k];
});

const selected = reactive(res);

watch(
  () => selected,
  () => {
    emit("selected", selected);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.control-panel {
  display: grid;
  grid-gap: 1rem;
  justify-items: center;
  align-items: end;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 25rem), 1fr));
}
.control-panel-dropdown {
  width: 100%;
  .select,
  select {
    width: 100%;
  }
}
</style>
