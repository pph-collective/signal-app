<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="buoy-select" class="label">Select Buoys</label>
        <multiselect
          id="buoy-select"
          v-model="selectedBuoys"
          class="multiselect"
          :options="store.coordinates"
          :custom-label="formatCoordinate"
          track-by="station_name"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="variable-select-visualize" class="label"
          >Select Variables (up to 4)</label
        >
        <multiselect
          id="variable-select-visualize"
          v-model="selectedVariables"
          class="multiselect"
          :options="store.variables"
          :custom-label="formatVariable"
          track-by="name"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="date-select" class="label">Select Date Range</label>
        <date-picker
          id="date-select"
          v-model:value="dateRange"
          :disabled-date="disabledDate"
          :default-value="[
            localISODateToUTC(store.minDate),
            localISODateToUTC(store.maxDate),
          ]"
          range
        />
      </div>
    </template>

    <template #buttons>
      <router-link
        :to="{
          path: datasetPath,
          query: {
            ids: selectedBuoysString,
            variables: selectedVariablesString,
            ...selectedDates,
          },
        }"
      >
        <button class="button is-primary" :disabled="disabled">
          Visualize
        </button>
      </router-link>
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { computed, inject, ref, withDefaults } from "vue";

import Multiselect from "vue-multiselect";
import DatePicker from "vue-datepicker-next";

import BaseForm from "@/components/base/BaseForm.vue";

import { Coordinate, Variable } from "../../utils/erddap";
import {
  formatCoordinate,
  formatVariable,
  localISODate,
  localISODateToUTC,
} from "../../utils/utils";

interface Props {
  initVariables?: Variable[];
  initBuoys?: Coordinate[];
  initDateRange?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  initVariables: () => [],
  initBuoys: () => [],
  initDateRange: () => [],
});

import { BuoyStore } from "../../store/buoy";
const store = inject("store") as BuoyStore;

const selectedBuoys = ref([...props.initBuoys]);
const selectedVariables = ref([...props.initVariables]);
const dateRange = ref(
  props.initDateRange.map((date) => {
    return localISODateToUTC(date);
  })
);

const disabled = computed(
  () =>
    selectedVariables.value.length > 4 ||
    selectedVariables.value.length === 0 ||
    dateRange.value.length !== 2 ||
    selectedBuoys.value.length === 0
);

const selectedDates = computed(() => {
  try {
    const isoDate = dateRange.value.map((date) => localISODate(date));
    return { start: isoDate[0], end: isoDate[1] };
  } catch (e) {
    return null;
  }
});

const selectedVariablesString = computed(() =>
  selectedVariables.value.map((v) => v.name).join(",")
);

const selectedBuoysString = computed(() => {
  return selectedBuoys.value.map((r) => r.buoyId).join(",");
});

const datasetPath = computed(() => `/dataset/${store.name}/dashboard`);

const disabledDate = (date) => {
  const utcDate = localISODate(date);
  return utcDate < store.minDate || utcDate > store.maxDate;
};
</script>
