<template>
  <div
    class="field is-horizontal is-justify-content-center is-align-items-center has-flex-gap"
  >
    <label for="date">Looking for data from another time period?</label>
    <div class="control has-icons-left is-flex is-justify-content-center">
      <div class="select">
        <select
          id="date"
          @change="
            $emit('selected', ($event.target as HTMLSelectElement).value)
          "
        >
          <option
            v-for="(option, index) in props.dropDown"
            :key="'option-' + index"
            :value="option.date"
            :selected="option.date === props.dropDown[0].date"
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
});
console.log(props.dropDown);
const emit = defineEmits(["selected"]);

const res = {};
Object.keys(props.dropDown[0]).forEach((k) => {
  console.log(k);
  res[k] = props.dropDown[0][k];
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
