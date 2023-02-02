<template>
  <div
    class="field is-horizontal is-justify-content-center is-align-items-center has-flex-gap"
  >
    <label for="date">Looking for data from another time period?</label>
    <div class="control has-icons-left is-flex is-justify-content-center">
      <div class="select">
        <select id="date" v-model="selected">
          <option
            v-for="(option, index) in dropDown"
            :key="'option-' + index"
            :value="option"
            :selected="option === selected"
          >
            {{ prettyDate(option) }}
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
import { PropType, ref, watch } from "vue";
import { prettyDate } from "../../utils/utils";

const props = defineProps({
  dropDown: {
    type: Array as PropType<string[]>,
    required: true,
  },
  initValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["newDate"]);

const selected = ref(props.initValue);

watch(
  () => selected,
  (item) => {
    emit("newDate", item.value);
  },
  { deep: true }
);
</script>
