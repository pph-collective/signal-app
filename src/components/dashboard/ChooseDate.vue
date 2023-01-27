<template>
  <div
    class="field is-horizontal is-justify-content-center is-align-items-center has-flex-gap"
  >
    <label for="date">Looking for data from another time period?</label>
    <div class="control has-icons-left is-flex is-justify-content-center">
      <div class="select">
        <select id="date" v-model="selected['date']">
          <option
            v-for="(option, index) in dropDown.date.values"
            :key="'option-' + index"
            :value="option.date"
            :selected="option.date === initValue.date"
          >
            {{ option.name }}
          </option>
        </select>
        <span class="icon is-small is-left pl-1">
          <i class="fas fa-calendar-alt"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps({
  dropDown: {
    type: Object,
    required: true,
  },
  initValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["selected"]);

const res = {};
Object.keys(props.dropDown).forEach((k) => {
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
