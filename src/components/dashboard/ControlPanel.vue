<template>
  <div
    class="control-panel is-family-secondary is-flex is-flex-direction-column"
  >
    <div
      v-for="(options, type) in dropDowns"
      :key="'control-panel-dropdown-' + type"
      class="control-panel-dropdown control has-icons-left m-2"
    >
      <label class="is-family-primary"
        ><strong>{{ options.label }}</strong></label
      >
      <span class="select">
        <select :id="type" v-model="selected[type]">
          <option
            v-for="(option, index) in options.values"
            :key="'option-' + index"
            :value="option"
          >
            {{ option.name || option }}
          </option>
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
});

const emit = defineEmits(["selected"]);

const res = {};
Object.keys(props.dropDowns).forEach((k) => {
  res[k] = props.dropDowns[k].values[0];
});

const selected = reactive(res);
emit("selected", selected);

watch(
  () => selected,
  () => {
    emit("selected", selected);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.control-panel-dropdown {
  width: 100%;
  .select,
  select {
    width: 100%;
  }
}
</style>
